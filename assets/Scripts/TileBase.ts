import GameData from "./GameData";

const { ccclass, property } = cc._decorator;

export const enum TileType {
	Normal_Hor = 0,
	Normal_Ver,
	Move_Hor,
	Broken_Hor,
	Spring_Hor,
	Touch_Hor
}

@ccclass
export default class TileBase extends cc.Component {

	private _tileType: TileType;

	private sprite: cc.Sprite;

	public get tileType() {
		return this._tileType;
	}

	protected onLoad() {
		this.sprite = this.getComponent(cc.Sprite)

	}

	public Init(type: TileType) {
		this.node.active = true;
		this._tileType = type;
		this.sprite.spriteFrame = GameData.Instance.tileSprites[this.tileType]
	}
}
