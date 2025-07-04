import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, Search, User, Check, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { toast } from "sonner";
import { Event, mockStaff } from "@/data/mockData";

interface ScheduleAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdd: (event: Event) => void;
}

export const ScheduleAddDialog = ({ open, onOpenChange, onEventAdd }: ScheduleAddDialogProps) => {
  const [scheduleType, setScheduleType] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState("");

  // 사업장 전용 일정 타입 - 개인레슨, 그룹레슨 제외
  const scheduleTypes = [
    { value: "holiday", label: "휴무일" },
    { value: "maintenance", label: "시설 점검" },
    { value: "event", label: "이벤트" },
    { value: "meeting", label: "회의" },
    { value: "other", label: "기타" }
  ];

  // 일정 유형별 색상 반환 함수 - 사업장 전용
  const getEventColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      case 'event': return 'bg-green-500';
      case 'meeting': return 'bg-gray-500';
      case 'other': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const staff = mockStaff.map(s => s.name);


  const handleSave = () => {
    if (!scheduleType) {
      toast.error("일정 유형을 선택해주세요.");
      return;
    }
    
    if (!title) {
      toast.error("일정 제목을 입력해주세요.");
      return;
    }
    
    if (!isAllDay && !startTime) {
      toast.error("시작 시간을 입력해주세요.");
      return;
    }
    
    if (!isAllDay && !endTime) {
      toast.error("종료 시간을 입력해주세요.");
      return;
    }
    
    if (selectedStaff.length === 0) {
      toast.error("담당자를 선택해주세요.");
      return;
    }

    // 새 이벤트 객체 생성
    const newEvent: Event = {
      id: `event_${Date.now()}`,
      title,
      date: selectedDate,
      time: isAllDay ? "하루종일" : startTime,
      duration: isAllDay ? "하루종일" : `${startTime} - ${endTime}`,
      type: scheduleType,
      trainer: undefined, // 사업장 일정에는 trainer 필드 사용 안함
      assignedTo: selectedStaff.join(', '),
      color: getEventColor(scheduleType),
      notes
    };

    // 부모 컴포넌트에 새 이벤트 전달
    onEventAdd(newEvent);
    
    toast.success(`${format(selectedDate, "M월 d일", { locale: ko })} 일정이 추가되었습니다.`);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setScheduleType("");
    setTitle("");
    setSelectedDate(new Date());
    setIsAllDay(true);
    setStartTime("");
    setEndTime("");
    setSelectedStaff([]);
    setSearchQuery("");
    setIsSearching(false);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>일정 추가</DialogTitle>
          <DialogDescription>
            새로운 일정을 추가합니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 일정 유형 */}
          <div className="space-y-2">
            <Label htmlFor="schedule-type">일정 유형</Label>
            <Select value={scheduleType} onValueChange={setScheduleType}>
              <SelectTrigger id="schedule-type">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {scheduleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">일정 제목</Label>
            <Input
              id="title"
              placeholder="일정 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 날짜 및 시간 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "yyyy년 M월 d일", { locale: ko }) : <span>날짜 선택</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 하루종일/시간 선택 */}
            <div className="space-y-3">
              <Label>시간 설정</Label>
              <RadioGroup
                value={isAllDay ? "all-day" : "time-range"}
                onValueChange={(value) => setIsAllDay(value === "all-day")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all-day" id="all-day" />
                  <Label htmlFor="all-day">하루종일</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time-range" id="time-range" />
                  <Label htmlFor="time-range">시간 선택</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 시간 설정 (시간 선택일 때만 표시) */}
            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">시작 시간</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">종료 시간</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 담당자 */}
          <div className="space-y-4">
            <Label>담당자 선택</Label>
            
            {/* 직원 검색 */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="직원을 검색하세요 (이름 입력)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearching(e.target.value.length > 0);
                  }}
                  onFocus={() => {
                    if (searchQuery) setIsSearching(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSearching(false), 200);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm ring-offset-background"
                />
                {isSearching && (
                  <div 
                    ref={searchResultsRef}
                    className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden"
                  >
                    <div className="max-h-[200px] overflow-auto p-1">
                      {/* 전체 선택 옵션 */}
                      <div 
                        className={cn(
                          "flex items-center justify-between w-full p-2 text-sm rounded-md cursor-pointer",
                          "hover:bg-accent hover:text-accent-foreground",
                          "border-b"
                        )}
                        onClick={() => {
                          if (selectedStaff.length === staff.length) {
                            setSelectedStaff([]);
                          } else {
                            setSelectedStaff(staff);
                          }
                          setSearchQuery("");
                          setIsSearching(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">전체 {selectedStaff.length === staff.length ? '해제' : '선택'}</span>
                        </div>
                        {selectedStaff.length === staff.length && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      {/* 검색된 직원 목록 */}
                      {searchQuery.length > 0 ? (
                        staff
                          .filter(person => 
                            person.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(person => {
                            const isSelected = selectedStaff.includes(person);
                            return (
                              <div 
                                key={person}
                                className={cn(
                                  "flex items-center justify-between w-full p-2 text-sm rounded-md cursor-pointer",
                                  "hover:bg-accent hover:text-accent-foreground",
                                  isSelected && "bg-accent/50"
                                )}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedStaff(selectedStaff.filter(s => s !== person));
                                  } else {
                                    setSelectedStaff([...selectedStaff, person]);
                                  }
                                  setSearchQuery("");
                                  setIsSearching(false);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{person}</span>
                                </div>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            );
                          })
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          직원 이름을 입력하세요
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 선택된 담당자 목록 */}
            {selectedStaff.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">선택된 담당자 ({selectedStaff.length}명)</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg max-h-32 overflow-y-auto">
                  {selectedStaff.map((person) => (
                    <Badge key={person} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <User className="h-3 w-3 mr-1" />
                      {person}
                      <button
                        type="button"
                        onClick={() => setSelectedStaff(selectedStaff.filter(s => s !== person))}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="notes">메모</Label>
            <Textarea
              id="notes"
              placeholder="추가 정보나 특이사항을 입력하세요 (선택사항)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex space-x-2 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gym-primary hover:bg-gym-primary/90"
          >
            일정 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};