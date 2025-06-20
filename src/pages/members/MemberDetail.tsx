
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Edit, 
  AlertTriangle,
} from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { MemberSummary } from "./components/MemberSummary";
import { AttendanceTab } from "./components/AttendanceTab";
import { PaymentHistoryTab } from "./components/PaymentHistoryTab";
import { MemberEditDialog } from "./components/MemberEditDialog";
import { LockerRegistrationDialog } from "./components/LockerRegistrationDialog";
import { MembershipTab } from "./components/MembershipTab";
import { MemberSuspensionDialog } from "./components/MemberSuspensionDialog";
import { PaymentRegistrationDialog } from "./components/PaymentRegistrationDialog";
import { PaymentDetailDialog } from "./components/PaymentDetailDialog";
import { toast } from "sonner"; // Added for success message

interface MemberDetailProps {
  id?: string;
}

const MemberDetail = ({ id: propId }: MemberDetailProps) => {
  const params = useParams<{ id: string }>();
  const urlId = params.id;
  const navigate = useNavigate();
  
  const id = propId || urlId;
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("membership");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [lockerDialogOpen, setLockerDialogOpen] = useState(false);
  const [suspensionDialogOpen, setSuspensionDialogOpen] = useState(false);
  const [paymentRegistrationOpen, setPaymentRegistrationOpen] = useState(false);
  const [paymentRegistrationType, setPaymentRegistrationType] = useState<'gym' | 'lesson' | 'locker' | 'other' | 'merchandise' | null>(null);
  const [paymentDetailOpen, setPaymentDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Mock auth check - replace with actual auth implementation
  const userRole = localStorage.getItem("userRole") || "trainer";
  const isOwner = userRole === "owner" || userRole === "admin";

  useEffect(() => {
    const fetchMember = () => {
      setLoading(true);
      try {
        const foundMember = mockMembers.find(m => m.id === id);
        if (foundMember) {
          setMember(foundMember);
        } else {
          console.error("회원을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("회원 정보를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  const handlePaymentRegistration = (type: 'gym' | 'lesson' | 'locker' | 'other' | 'merchandise') => {
    // 타입을 그대로 사용 (PaymentRegistrationDialog에서 처리)
    setPaymentRegistrationType(type);
    setPaymentRegistrationOpen(true);
  };
  
  const handleSuspension = () => {
    setSuspensionDialogOpen(true);
  };
  
  const handleViewPaymentDetail = (payment: any) => {
    setSelectedPayment(payment);
    setPaymentDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">회원 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="flex items-center gap-1.5 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">회원을 찾을 수 없습니다</CardTitle>
            <CardDescription>
              요청하신 ID({id})에 해당하는 회원 정보가 존재하지 않습니다.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 및 액션 버튼 */}
      <div className="flex justify-between items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleSuspension}
            className="flex items-center gap-2 text-sm"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>정지 등록</span>
          </Button>
          
          <Button 
            onClick={() => setEditDialogOpen(true)}
            className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
          >
            <Edit className="h-4 w-4" />
            <span>회원 정보 수정</span>
          </Button>
        </div>
      </div>

      {/* 회원 정보 요약 */}
      <MemberSummary member={member} />

      {/* 메인 콘텐츠 탭 */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2">
              <TabsTrigger value="membership" className="px-4 py-2 text-sm">이용권 정보</TabsTrigger>
              <TabsTrigger value="attendance" className="px-4 py-2 text-sm">출석 현황</TabsTrigger>
              <TabsTrigger value="payment" className="px-4 py-2 text-sm">결제/정지 내역</TabsTrigger>
            </TabsList>
            
            <TabsContent value="membership" className="mt-6">
              <MembershipTab 
                member={member} 
                onPaymentRegister={handlePaymentRegistration} 
                isOwner={isOwner} 
              />
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-6">
              <AttendanceTab memberId={member.id} />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <PaymentHistoryTab 
                memberId={member.id} 
                onViewDetail={handleViewPaymentDetail}
                isOwner={isOwner}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 다이얼로그들 */}
      <MemberEditDialog 
        member={member}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(updatedMember) => {
          setMember(updatedMember);
          // Update mockMembers to persist changes during the session
          const memberIndex = mockMembers.findIndex(m => m.id === updatedMember.id);
          if (memberIndex !== -1) {
            mockMembers[memberIndex] = updatedMember;
          }
          setEditDialogOpen(false);
          toast.success("회원 정보가 성공적으로 수정되었습니다.");
        }}
      />

      <LockerRegistrationDialog
        member={member}
        open={lockerDialogOpen}
        onOpenChange={setLockerDialogOpen}
        onSave={() => {
          setLockerDialogOpen(false);
        }}
      />
      
      <MemberSuspensionDialog
        member={member}
        open={suspensionDialogOpen}
        onOpenChange={setSuspensionDialogOpen}
        onSave={(duration, reason) => {
          // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
          console.log(`회원 정지 등록: ${duration}일, 사유: ${reason}`);
          setSuspensionDialogOpen(false);
          
          // 임시 데이터 업데이트 (실제 구현에서는 API 응답으로 업데이트)
          if (member) {
            const updatedMember = { ...member };
            if (!updatedMember.suspensionRecords) {
              updatedMember.suspensionRecords = [];
            }
            
            updatedMember.suspensionRecords.push({
              date: new Date().toISOString().split('T')[0],
              duration,
              reason,
              approver: userRole
            });
            
            setMember(updatedMember);
          }
        }}
      />
      
      <PaymentRegistrationDialog
        member={member}
        type={paymentRegistrationType}
        open={paymentRegistrationOpen}
        onOpenChange={setPaymentRegistrationOpen}
        onSave={(paymentData) => {
          // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
          console.log('결제 등록:', paymentData);
          setPaymentRegistrationOpen(false);
          setPaymentRegistrationType(null);
          
          // 임시 데이터 업데이트 (실제 구현에서는 API 응답으로 업데이트)
          if (member) {
            const updatedMember = { ...member };
            
            // 결제 유형에 따라 회원 데이터 업데이트
            switch (paymentData.category) {
              case 'gym': {
                updatedMember.membershipActive = true;
                updatedMember.membershipStartDate = paymentData.serviceStartDate;
                // 임의로 1년 후로 설정 (실제로는 상품에 따라 다름)
                const endDate = new Date(paymentData.serviceStartDate || new Date());
                endDate.setFullYear(endDate.getFullYear() + 1);
                updatedMember.membershipEndDate = endDate.toISOString().split('T')[0];
                updatedMember.gymMembershipDaysLeft = 365;
                break;
              }
              case 'lesson': {
                updatedMember.hasLesson = true;
                updatedMember.lessonStartDate = paymentData.serviceStartDate;
                updatedMember.lessonTotal = 10; // 임의 설정 (실제로는 상품에 따라 다름)
                updatedMember.lessonRemaining = 10;
                // 임의로 6개월 후로 설정
                const lessonEndDate = new Date(paymentData.serviceStartDate || new Date());
                lessonEndDate.setMonth(lessonEndDate.getMonth() + 6);
                updatedMember.lessonExpiryDate = lessonEndDate.toISOString().split('T')[0];
                updatedMember.trainerAssigned = paymentData.instructor;
                break;
              }
              case 'locker':
                updatedMember.lockerInfo = {
                  name: paymentData.product,
                  daysLeft: 30, // 임의 설정
                  startDate: paymentData.serviceStartDate,
                  endDate: paymentData.serviceStartDate ? new Date(new Date(paymentData.serviceStartDate).setMonth(new Date(paymentData.serviceStartDate).getMonth() + 1)).toISOString().split('T')[0] : undefined,
                  lockerNumber: paymentData.lockerNumber,
                  notes: paymentData.memo
                };
                break;
              case 'other':
              case 'merchandise':
                if (!updatedMember.otherProducts) {
                  updatedMember.otherProducts = [];
                }
                
                updatedMember.otherProducts.push({
                  name: paymentData.product,
                  startDate: paymentData.serviceStartDate,
                  endDate: paymentData.serviceStartDate ? new Date(new Date(paymentData.serviceStartDate).setMonth(new Date(paymentData.serviceStartDate).getMonth() + 1)).toISOString().split('T')[0] : undefined,
                  type: paymentData.product.split(' ')[0] // 임의 설정
                });
                break;
            }
            
            // 미수금 업데이트
            if (parseFloat(paymentData.unpaidAmount || "0") > 0) {
              updatedMember.unpaidAmount = (updatedMember.unpaidAmount || 0) + parseFloat(paymentData.unpaidAmount || "0");
            }
            
            setMember(updatedMember);
          }
        }}
      />
      
      <PaymentDetailDialog
        payment={selectedPayment}
        open={paymentDetailOpen}
        onOpenChange={setPaymentDetailOpen}
        isOwner={isOwner}
        onEdit={(updatedPayment) => {
          // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
          console.log('결제 수정:', updatedPayment);
          setPaymentDetailOpen(false);
        }}
        onDelete={(paymentId) => {
          // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
          console.log('결제 삭제:', paymentId);
          setPaymentDetailOpen(false);
        }}
      />
    </div>
  );
};

export default MemberDetail;
