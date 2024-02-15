// #region Driver
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

export type TDriverForm = {
  firstName: String;
  lastName: String;
  defaultTruck?: String;
  endDumpPayRate: Number;
  flatBedPayRate: Number;
  ncPayRate: Number;
  dateHired?: Date;
  dateReleased?: Date;
  isActive?: Boolean;
};
// #endregion

// #region Vendor
export type TVendor = {
  id: Number;
  name: String;
  shortName: String;
  chtFuelSurcharge: Number;
  vendorFuelSurcharge: Number;
  isActive?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TVendorForm = {
  name: String;
  shortName: String;
  chtFuelSurcharge: Number;
  vendorFuelSurcharge: Number;
  isActive?: Boolean;
};
// #endregion
