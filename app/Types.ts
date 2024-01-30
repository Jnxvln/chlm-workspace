export type TDriver = {
  id: Number;
  firstName: String;
  lastName: String;
  defaultTruck?: String;
  endDumpPayRate: Number;
  flatBedPayRate: Number;
  ncPayRate: Number;
  dateHired?: Date;
  dateReleased?: Date;
  isActive?: Boolean;
  createdAt: Date;
  updatedAt: Date;
};
