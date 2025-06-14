type Subscription = {
  plan?: string;
  super_admins?: boolean;
  admins?: number;
};

export type AppConfig = {
  id?: number;
  org_name?: string;
  timezone?: string;
  subscription?: Subscription;
};
