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

export type TContactForm = {
  firstName: String;
  lastName: String;
  phone: String;
  address?: String;
  email?: String;
  locations?: Array<any>; // update `any` to its own type
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
