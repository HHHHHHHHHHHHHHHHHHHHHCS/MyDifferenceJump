import TileBase from "./TileBase";
import GameData from "./GameData";
import ObjectPool from "./ObjectPool";
import GameGameManager from "./GameGameManager";
import MyU from "./My/MyU";
import { EffectAudioEnum } from "./GameAudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchBreakChild extends cc.Component {

	private sprite: cc.Sprite;
	private collider: cc.BoxCollider;
	private moveDir: number;
	private halfX: number;


	protected onLoad() {
		this.sprite = this.getComponent(cc.Sprite);
		this.collider = this.getComponent(cc.BoxCollider);
		this.halfX = this.node.x / 2;
	}

	public OnInit(tile: TileBase, isLeft: boolean) {
		this.collider.enabled = true;
		this.moveDir = isLeft ? -1 : 1;
		let gameData = GameData.Instance;
		this.sprite.spriteFrame = isLeft ? GameData.Instance.touchBreakLeftSprites : GameData.Instance.touchBreakRightSprites;
		let x = tile.node.x + (isLeft ? this.halfX : -this.halfX);
		this.node.setPosition(x, tile.node.y);
		this.node.active = true;
		this.node.runAction(
			cc.sequence(
				cc.moveBy(GameData.Instance.touchBreakTime, this.moveDir * GameData.Instance.XLength, 0),
				cc.callFunc(this.Recovery, this, this),
			)
		);
	}

	public DoJump() {
		this.collider.enabled = false;
		GameGameManager.Instance.audioManager.PlayEffectAudio(EffectAudioEnum.touchBreakAudio);
		this.node.runAction(cc.sequence(
			cc.moveBy(0.5, 0, -500),
			cc.callFunc(this.Recovery, this, this),
		));
	}

	public Recovery(node: cc.Node, touchBreak: TouchBreakChild) {
		node.stopAllActions();
		GameGameManager.Instance.tileManager.RecoveryTouchBreak(touchBreak);
	}
}
