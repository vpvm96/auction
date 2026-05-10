/**
 * lib/onbid.ts unit tests
 *
 * 온비드 사이트 리뉴얼로 이미지 다운로드 엔드포인트가 변경되었으나
 * Open API는 아직 구 URL을 반환하므로, 클라이언트에서 신 URL로 보정한다.
 */

import { fixOnbidImageUrl } from "@/lib/onbid";

describe("fixOnbidImageUrl", () => {
  it("converts old onbid URL to new endpoint with remapped params", () => {
    const oldUrl =
      "https://www.onbid.co.kr/op/common/downloadFile.do?atchFilePtcsNo=16966162&atchSeq=2";
    const result = fixOnbidImageUrl(oldUrl);

    expect(result).not.toBeNull();
    const parsed = new URL(result!);
    expect(parsed.origin).toBe("https://www.onbid.co.kr");
    expect(parsed.pathname).toBe(
      "/op/cm/syc/filemng/filemngprcs/FileMngPrcsController/dnldImgFile.do",
    );
    expect(parsed.searchParams.get("atchFileLstNo")).toBe("16966162");
    expect(parsed.searchParams.get("atchSn")).toBe("2");
    expect(parsed.searchParams.get("thnImgDownloadFlag")).toBe("false");
    expect(parsed.searchParams.get("downloadImageKind")).toBe("ELGM_FILE_NM");
  });

  it("passes through new endpoint URL unchanged", () => {
    const newUrl =
      "https://www.onbid.co.kr/op/cm/syc/filemng/filemngprcs/FileMngPrcsController/dnldImgFile.do?atchFileLstNo=1&atchSn=1&thnImgDownloadFlag=false&downloadImageKind=ELGM_FILE_NM";
    expect(fixOnbidImageUrl(newUrl)).toBe(newUrl);
  });

  it("passes through unrelated URLs unchanged", () => {
    const otherUrl = "https://images.unsplash.com/photo-123?w=400";
    expect(fixOnbidImageUrl(otherUrl)).toBe(otherUrl);
  });

  it("returns null for null / undefined / empty input", () => {
    expect(fixOnbidImageUrl(null)).toBeNull();
    expect(fixOnbidImageUrl(undefined)).toBeNull();
    expect(fixOnbidImageUrl("")).toBeNull();
  });

  it("handles missing atchFilePtcsNo / atchSeq gracefully (empty values)", () => {
    const partial =
      "https://www.onbid.co.kr/op/common/downloadFile.do?atchFilePtcsNo=12345";
    const result = fixOnbidImageUrl(partial);

    expect(result).not.toBeNull();
    const parsed = new URL(result!);
    expect(parsed.searchParams.get("atchFileLstNo")).toBe("12345");
    expect(parsed.searchParams.get("atchSn")).toBe("");
  });
});
