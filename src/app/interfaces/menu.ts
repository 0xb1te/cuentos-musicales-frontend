export interface MenuItem {
  id: number;
  title: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
}
