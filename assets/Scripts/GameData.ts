const { ccclass, property } = cc._decorator;

export const enum Tags {
	Player = 0,
	Tile,
}

export const enum GameState {
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

	//回收-----------
	public static startTileY: number = -750;//开始跳板的Y,第一个会加一个nextTileY
	public static nextTileY: number = 350;//下一个跳板的Y
	public static recoveryTileY: number = 10;//跳板回收的Y

	//边界-----------
	public static xMinBorder: number;//x最小的边界
	public static xMaxBorder: number;//x最大的边界
	public static halfYBorder: number;//y的一半

	//难度-----------
	public static hardBase: number = 1.005;//难度的基数

	//跳板生成权重-----------
	public static allTileWeight = 0;//跳板的总权重,自动生成
	public static normalHorWeight = 1;//左右正常跳板
	public static normalVerWeight = 0.20;//上下跳板
	public static normalVerNext = 3;//上下跳板生成间隔

	//跳板参数-----------
	public static horMoveClamp = 250;//上下跳板移动的距离

	@property(cc.Prefab)
	public tilePrefab: cc.Prefab = null;

	@property([cc.SpriteFrame])
	public tileSprites: cc.SpriteFrame[] = [];



	onLoad() {
		GameData.instance = this;
		let world = cc.find("World").getComponent(cc.Canvas).designResolution;
		GameData.xMaxBorder = world.width / 2;
		GameData.xMinBorder = -GameData.xMaxBorder;
		GameData.halfYBorder = world.height / 2;
		GameData.recoveryTileY += GameData.halfYBorder;

		GameData.normalVerWeight += GameData.normalHorWeight;
		GameData.allTileWeight = GameData.normalVerWeight;
	}
}
