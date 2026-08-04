import { LegalDocumentScreen } from "@/components/my/legal-document-screen";
import { LOCAL_TERMS } from "@/constants/legalDocuments";
import { fetchTerms } from "@/lib/api/legal";

export default function TermsScreen() {
  return (
    <LegalDocumentScreen
      title="이용약관"
      queryKey="terms"
      queryFn={fetchTerms}
      fallback={LOCAL_TERMS}
    />
  );
}
