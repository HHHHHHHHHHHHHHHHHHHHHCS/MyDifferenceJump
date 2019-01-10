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

	private startTouchEvent: Function;
	private keepTouchEvent: Function;
	private endTouchEvent: Function;

	public get tileType() {
		return this._tileType;
	}

	protected onLoad() {
		this.sprite = this.node.getChildByName("TileImage").getComponent(cc.Sprite);

		this.node.on(cc.Node.EventType.TOUCH_START, this.StartTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.KeepTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.EndTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.EndTouch, this);
	}

	public Init(type: TileType, pos: cc.Vec2) {
		this.node.active = true;
		this._tileType = type;
		this.sprite.spriteFrame = GameData.Instance.tileSprites[this.tileType];
		this.node.position = pos;

		this.RegisterEvent();
	}

	private RegisterEvent() {
		switch (this._tileType) {
			case TileType.Normal_Hor: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Normal_Hor_Keep;
				this.endTouchEvent = this.Normal_Hor_End;
				break;
			}
			case TileType.Normal_Ver: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Normal_Ver_Keep;
				this.endTouchEvent = this.Normal_Hor_End;
				break;
			}
		}
	}

	private StartTouch(event: cc.Event.EventTouch) {
		if (this.startTouchEvent) {
			this.startTouchEvent();
		}
		event.stopPropagation();
	}

	private KeepTouch(event: cc.Event.EventTouch) {
		if (this.keepTouchEvent) {
			this.keepTouchEvent(event)
		}
		event.stopPropagation();
	}

	private EndTouch(event: cc.Event.EventTouch) {
		if (this.endTouchEvent) {
			this.endTouchEvent(event)
		}
		event.stopPropagation();
	}

	public Recovery() {
		//this.node.off(cc.Node.EventType.TOUCH_START, this.StartTouch, this);
		//this.node.off(cc.Node.EventType.TOUCH_MOVE, this.KeepTouch, this);
		//this.node.off(cc.Node.EventType.TOUCH_END, this.EndTouch, this);
		//this.node.off(cc.Node.EventType.TOUCH_Cancel, this.EndTouch, this);

		this.startTouchEvent = null;
		this.keepTouchEvent = null;
		this.endTouchEvent = null;
	}

	//#region Normal_Hor_Tile Normal_Ver_Tile

	private Normal_Start() {
		this.node.opacity = 200;
	}

	private Normal_Hor_Keep(event: cc.Event.EventTouch) {
		let delta = event.touch.getDelta();
		this.node.x += delta.x;
	}

	private Normal_Ver_Keep(event: cc.Event.EventTouch) {
		let delta = event.touch.getDelta();
		this.node.y += delta.y;
	}

	private Normal_Hor_End() {
		this.node.opacity = 255;
	}

	//#endregion
}
