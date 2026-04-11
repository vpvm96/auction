import { LegalDocumentScreen } from "@/components/my/legal-document-screen";
import { fetchPrivacyPolicy } from "@/lib/api/legal";

export default function PrivacyScreen() {
  return (
    <LegalDocumentScreen
      title="개인정보처리방침"
      queryKey="privacy"
      queryFn={fetchPrivacyPolicy}
    />
  );
}
