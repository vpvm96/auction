/**
 * 온비드 이미지 URL 변환 유틸.
 *
 * 온비드(www.onbid.co.kr)는 최근 사이트 리뉴얼 과정에서 이미지 다운로드
 * 엔드포인트와 파라미터 이름을 변경했으나, 공공 Open API는 아직 구 URL을
 * 그대로 반환하고 있어 모바일에서 이미지 로딩이 실패한다.
 *
 * 이 함수는 Open API에서 받은 이미지 URL이 구 형식이면 신 형식으로 변환하고,
 * 신 형식이거나 외부(타 도메인) URL이면 그대로 통과시킨다.
 *
 * 파라미터 매핑:
 *   atchFilePtcsNo -> atchFileLstNo
 *   atchSeq        -> atchSn
 *   (추가) thnImgDownloadFlag=false, downloadImageKind=ELGM_FILE_NM
 */

const OLD_ENDPOINT = '/op/common/downloadFile.do'
const NEW_ENDPOINT =
  '/op/cm/syc/filemng/filemngprcs/FileMngPrcsController/dnldImgFile.do'
const BASE_URL = 'https://www.onbid.co.kr'

export function fixOnbidImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null

  // 이미 신 URL이면 그대로
  if (url.includes(NEW_ENDPOINT)) return url

  // 구 URL이 아니면 변환 없이 그대로 (외부 도메인, 다른 엔드포인트 등)
  if (!url.includes(OLD_ENDPOINT)) return url

  try {
    const urlObj = new URL(url)
    const atchFileLstNo = urlObj.searchParams.get('atchFilePtcsNo') ?? ''
    const atchSn = urlObj.searchParams.get('atchSeq') ?? ''

    const newParams = new URLSearchParams({
      atchFileLstNo,
      atchSn,
      thnImgDownloadFlag: 'false',
      downloadImageKind: 'ELGM_FILE_NM',
    })

    return `${BASE_URL}${NEW_ENDPOINT}?${newParams.toString()}`
  } catch {
    // URL 파싱 실패 시 원본 URL 유지 (이미지 로딩이 실패하는 편이 잘못된 변환보다 안전)
    return url
  }
}
