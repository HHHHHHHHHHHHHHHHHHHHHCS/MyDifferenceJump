import Player from "./Player";
import MyU from "./My/MyU";
import TileBase from "./TileBase";
import GameData from "./GameData";

const { ccclass, property } = cc._decorator;

export const enum ItemType {
	None = 0,
	Hat,
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

	/** 初始化 */
	public OnInit(type: ItemType, tile: TileBase) {
		this.itemType = type;
		this.bindTile = tile;
		tile.bindItem = this;
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

	/** 更新位置 */
	public UpdatePos() {
		this.node.position = this.bindTile.CenterUpPos;
	}

	/** 玩家吃到了物品,执行事件 */
	public DoItem(player: Player) {
		switch (this.itemType) {
			case ItemType.Hat: {
				player.DoFly(true, GameData.Instance.hatFlySpeed, GameData.Instance.hatFlyTime);
				break;
			}
			case ItemType.Rocket: {
				player.DoFly(false, GameData.Instance.rocketFlySpeed, GameData.Instance.rocketFlyTime);
				break;
			}
		}
	}

	/** 隐藏全部图片 */
	public HideAll() {
		this.hat.active = false;
		this.rocket.active = false;
		this.fronzen.active = false;
		this.spring.active = false;
		this.anticipation.active = false;
		this.magnifier.active = false;
	}

	/** 回收 */
	public Recovery() {
		this.bindTile.bindItem = null;
		this.bindTile = null;
	}
}
