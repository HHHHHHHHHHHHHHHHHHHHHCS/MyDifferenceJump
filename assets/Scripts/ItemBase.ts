import Player from "./Player";
import MyU from "./My/MyU";
import TileBase from "./TileBase";

const { ccclass, property } = cc._decorator;

export const enum ItemType {
	Hat = 0,
	Rocket,
	Frozen,
	Spring,
	Anticipation,
	Magnifier,
}

@ccclass
/** 物品 */
export default class ItemBase extends cc.Component {

	private itemType: ItemType;
	private bindTile: TileBase;

	private hat: cc.Node;
	private rocket: cc.Node;
	private fronzen: cc.Node;
	private spring: cc.Node;
	private anticipation: cc.Node;
	private magnifier: cc.Node;

	onLoad() {

		this.hat = cc.find("Hat", this.node);
		this.rocket = cc.find("Rocket", this.node);
		this.fronzen = cc.find("Frozen", this.node);
		this.spring = cc.find("Spring", this.node);
		this.anticipation = cc.find("Anticipation", this.node);
		this.magnifier = cc.find("Magnifier", this.node);

	}

	public OnInit(type: ItemType, tile: TileBase) {
		this.itemType = type;
		this.bindTile = tile;
		this.HideAll();
		this.UpdatePos();
		switch (type) {
			case ItemType.Hat: {
				this.hat.active = true;
				break;
			}
			case ItemType.Rocket: {
				this.rocket.active = true;
				break;
			}
			case ItemType.Frozen: {
				this.fronzen.active = true;
				break;
			}
			case ItemType.Spring: {
				this.spring.active = true;
				break;
			}
			case ItemType.Anticipation: {
				this.anticipation.active = true;
				break;
			}
			case ItemType.Magnifier: {
				this.magnifier.active = true;
				break;
			}
		}
		this.node.active = true;
	}

	public UpdatePos() {
		this.node.position = this.bindTile.CenterUpPos;
	}

	public DoItem(player: Player) {

	}

	public HideAll() {
		this.hat.active = false;
		this.rocket.active = false;
		this.fronzen.active = false;
		this.spring.active = false;
		this.anticipation.active = false;
		this.magnifier.active = false;
	}


}
