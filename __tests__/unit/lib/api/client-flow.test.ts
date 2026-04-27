/**
 * API Client — fetch flow + token refresh tests
 */
type AsyncStorageMock = jest.Mocked<
  typeof import("@react-native-async-storage/async-storage").default
>;

async function loadStorage(): Promise<AsyncStorageMock> {
  const mod = await import("@react-native-async-storage/async-storage");
  return mod.default as AsyncStorageMock;
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: `status ${status}`,
    json: async () => body,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  } as unknown as Response;
}

function emptyResponse(status: number): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: `status ${status}`,
    json: async () => ({}),
    text: async () => "",
  } as unknown as Response;
}

describe("apiClient", () => {
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    fetchMock = jest.fn() as unknown as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("attaches Bearer token from storage when not skipping auth", async () => {
    const storage = await loadStorage();
    storage.getItem.mockResolvedValueOnce("stored-token");
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    const { apiClient } = await import("@/lib/api/client");

    const result = await apiClient<{ ok: boolean }>("/foo");

    expect(result).toEqual({ ok: true });
    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer stored-token");
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("omits Authorization header when skipAuth is true", async () => {
    const storage = await loadStorage();
    storage.getItem.mockResolvedValueOnce("stored-token");
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    const { apiClient } = await import("@/lib/api/client");

    await apiClient("/foo", { skipAuth: true });

    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBeUndefined();
  });

  it("returns undefined for 204 No Content", async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse(204));
    const { apiClient } = await import("@/lib/api/client");

    const result = await apiClient<undefined>("/foo");

    expect(result).toBeUndefined();
  });

  it("throws ApiError with status when response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse("server boom", 500));
    const { apiClient, ApiError } = await import("@/lib/api/client");

    const err = (await apiClient("/foo").catch((e) => e)) as InstanceType<typeof ApiError>;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(500);
  });

  it("refreshes token on 401 then retries with the new token", async () => {
    const storage = await loadStorage();
    storage.getItem.mockResolvedValueOnce("expired-token");
    fetchMock
      .mockResolvedValueOnce(emptyResponse(401))
      .mockResolvedValueOnce(jsonResponse({ accessToken: "new-token" }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));
    const { apiClient, resetForceLogoutFlag } = await import("@/lib/api/client");
    resetForceLogoutFlag();

    const result = await apiClient<{ ok: boolean }>("/foo");

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const [, retryInit] = fetchMock.mock.calls[2];
    const headers = retryInit?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer new-token");
    expect(storage.setItem).toHaveBeenCalledWith("access-token", "new-token");
  });

  it("triggers force-logout callback when refresh fails", async () => {
    const storage = await loadStorage();
    storage.getItem.mockResolvedValueOnce("expired-token");
    fetchMock
      .mockResolvedValueOnce(emptyResponse(401))
      .mockResolvedValueOnce(emptyResponse(401));
    const { apiClient, setForceLogoutCallback, resetForceLogoutFlag } = await import(
      "@/lib/api/client"
    );
    const onLogout = jest.fn();
    setForceLogoutCallback(onLogout);
    resetForceLogoutFlag();

    await expect(apiClient("/foo")).rejects.toMatchObject({ status: 401 });

    expect(onLogout).toHaveBeenCalledTimes(1);
    expect(storage.removeItem).toHaveBeenCalledWith("access-token");
  });

  it("triggers force-logout when retry returns 401", async () => {
    const storage = await loadStorage();
    storage.getItem.mockResolvedValueOnce("expired-token");
    fetchMock
      .mockResolvedValueOnce(emptyResponse(401))
      .mockResolvedValueOnce(jsonResponse({ accessToken: "new-token" }))
      .mockResolvedValueOnce(emptyResponse(401));
    const { apiClient, setForceLogoutCallback, resetForceLogoutFlag } = await import(
      "@/lib/api/client"
    );
    const onLogout = jest.fn();
    setForceLogoutCallback(onLogout);
    resetForceLogoutFlag();

    await expect(apiClient("/foo")).rejects.toMatchObject({ status: 401 });

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("dedupes concurrent refreshes via the in-flight promise", async () => {
    const storage = await loadStorage();
    storage.getItem
      .mockResolvedValueOnce("expired-1")
      .mockResolvedValueOnce("expired-2");
    let resolveRefresh: (r: Response) => void = () => {};
    const refreshPromise = new Promise<Response>((res) => {
      resolveRefresh = res;
    });

    fetchMock
      .mockResolvedValueOnce(emptyResponse(401))
      .mockResolvedValueOnce(emptyResponse(401))
      .mockReturnValueOnce(refreshPromise)
      .mockResolvedValueOnce(jsonResponse({ a: 1 }))
      .mockResolvedValueOnce(jsonResponse({ b: 2 }));

    const { apiClient, resetForceLogoutFlag } = await import("@/lib/api/client");
    resetForceLogoutFlag();

    const p1 = apiClient<{ a: number }>("/one");
    const p2 = apiClient<{ b: number }>("/two");

    await new Promise((r) => setImmediate(r));
    resolveRefresh(jsonResponse({ accessToken: "shared-new" }));

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toEqual({ a: 1 });
    expect(r2).toEqual({ b: 2 });

    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});

describe("ApiError", () => {
  it("captures status and message", async () => {
    const { ApiError } = await import("@/lib/api/client");
    const err = new ApiError(403, "forbidden");
    expect(err.status).toBe(403);
    expect(err.message).toBe("forbidden");
    expect(err.name).toBe("ApiError");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("token storage helpers", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("getAccessToken/setAccessToken/removeAccessToken proxy AsyncStorage", async () => {
    const storage = await loadStorage();
    const { getAccessToken, setAccessToken, removeAccessToken } = await import(
      "@/lib/api/client"
    );

    storage.getItem.mockResolvedValueOnce("hello");
    expect(await getAccessToken()).toBe("hello");
    expect(storage.getItem).toHaveBeenCalledWith("access-token");

    await setAccessToken("new");
    expect(storage.setItem).toHaveBeenCalledWith("access-token", "new");

    await removeAccessToken();
    expect(storage.removeItem).toHaveBeenCalledWith("access-token");
  });
});
