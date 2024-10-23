export interface IMenuItem {
  label: string;
  icon?: string;
  route?: string;
  active?: boolean;
  isDropdown?: boolean;
  dropdownItems? : IMenuItem[];
}
