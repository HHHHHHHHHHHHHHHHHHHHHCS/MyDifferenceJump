const { ccclass, property } = cc._decorator;

export const enum Tags {
	Player = 0,
	Tile,
}

export const enum GameState{
	Ready,
	Playing,
	Stop,
	GameOver
}

@ccclass
/** 
 * 必须要在MainGameManager上面 脚本执行顺序问题 
 * 
 * 
 * */
export default class GameData extends cc.Component {
	private static instance: GameData;

	public static get Instance() {
		return GameData.instance;
	}

	public static startTileY: number = -750;//开始跳板的Y,第一个会加一个nextTileY
	public static nextTileY: number = 350;//下一个跳板的Y
	public static recoveryTileY: number = 1200;//跳板回收的Y

	public static xMinBorder: number;//x最小的边界
	public static xMaxBorder: number;//x最大的边界
	public static halfYBorder: number;//y的一半

	@property(cc.Prefab)
	public tilePrefab: cc.Prefab = null;

	@property([cc.SpriteFrame])
	public tileSprites: cc.SpriteFrame[] = [];



	onLoad() {
		GameData.instance = this;
		let canvas = cc.Canvas.instance.node;
		GameData.xMaxBorder = canvas.x;
		GameData.xMinBorder = -GameData.xMaxBorder;
		GameData.halfYBorder = canvas.y;
	}
}