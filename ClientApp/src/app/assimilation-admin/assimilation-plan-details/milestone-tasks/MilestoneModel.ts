export class Milestone {
  public msId!: number;
  public msName!: string;
  public durationDesc!: string;
  public DurationId !: number;
  public durationCalDesc!: string;
  public DurationCalId!: number;
  public milestonePeriod!: string;
  public milestonDescription!: string;
  public startDay!: number;
  public endDay!: number;
  public tasks!: Tasks[];
  public greetingText!: string;
}

export class Tasks {
  public msId!: number;
  public taskId!: number;
  public selectedTaskId!: number;
  public activeStatus !: boolean;
  public taskName!: string;
  public taskDesc!: string;
  public image!: string;
  public gradeIds !: string;
  public grades !: any[];
  public reDirectionLink!: string;
  public reminderId!: number;
  public reminderDesc!: string;
  public repeatId!: number;
  public repeatDesc!: string;
  public isMarkEnabled!: boolean;
}
