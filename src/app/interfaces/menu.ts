export interface MenuItem {
  id: number;
  route?: string; // Optional because not all items have a route
  title: string;
  children?: MenuItem[]; // Optional because not all items have children
}

export interface MenuStructure {
  items: MenuItem[];
}

export interface MenuResponse {
  id: number;
  menuStructure: MenuStructure;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
