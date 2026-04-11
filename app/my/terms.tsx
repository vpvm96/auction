import { LegalDocumentScreen } from "@/components/my/legal-document-screen";
import { fetchTerms } from "@/lib/api/legal";

export default function TermsScreen() {
  return (
    <LegalDocumentScreen
      title="이용약관"
      queryKey="terms"
      queryFn={fetchTerms}
    />
  );
}
