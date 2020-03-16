import { BTreeMenuModel } from "@app/core/models/btree-menu.model";
import { SystemMenuModel } from "@app/core/models/system-menu.model";
export class HierarchyMenuModel extends BTreeMenuModel 
{       
    nodes: SystemMenuModel[];       
}