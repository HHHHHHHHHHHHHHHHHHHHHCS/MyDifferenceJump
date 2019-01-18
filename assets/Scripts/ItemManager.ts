import Player from "./Player";
import ItemBase from "./ItemBase";
import MyU from "./My/MyU";

/** 物品管理器 */
export default class ItemManager {

	public static GetItem(player: Player, other: cc.Collider): void {
		other.node.parent.getComponent(ItemBase).DoItem(player);
	}

}