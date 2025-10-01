import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "sonner";

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("student_id", id)
      .single();

    if (error) {
      toast.error("Erro ao carregar aluno");
      return;
    }
    setStudent(data);
  };

  if (!student) return <div className="p-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/students")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={() => navigate(`/students/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{student.first_name} {student.last_name}</CardTitle>
              <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Informações Pessoais</h3>
                <div className="space-y-2 text-sm">
                  {student.email && <p><strong>Email:</strong> {student.email}</p>}
                  {student.phone && <p><strong>Telefone:</strong> {student.phone}</p>}
                  {student.birth_date && <p><strong>Nascimento:</strong> {new Date(student.birth_date).toLocaleDateString()}</p>}
                  {student.address && <p><strong>Endereço:</strong> {student.address}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Informações Acadêmicas</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Matrícula:</strong> {new Date(student.enrollment_date).toLocaleDateString()}</p>
                  {student.grade_level && <p><strong>Série:</strong> {student.grade_level}</p>}
                  {student.gpa && <p><strong>Média:</strong> {student.gpa}</p>}
                </div>
              </div>
            </div>
            {student.notes && (
              <div>
                <h3 className="font-semibold mb-2">Observações</h3>
                <p className="text-sm text-muted-foreground">{student.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetailPage;
