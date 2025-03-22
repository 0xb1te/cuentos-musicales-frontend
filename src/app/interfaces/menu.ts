export interface MenuItem {
  id: number;
  route?: string; // Optional because not all items have a route
  title: string;
  imageUrl?: string; // Optional URL for menu images
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

export interface MenuOptionRequest {
  parentId: number;
  title: string;
  route?: string;
  imageUrl?: string;
}
