import { JournalDetail } from "./stockJournal.type";
import { Store } from "./store.type";

export interface NotifSuperAdmin {
  count: number;
  type: string;
  store: Store;
  JournalDetail: JournalDetail[];
}
