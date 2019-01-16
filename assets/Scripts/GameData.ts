const { ccclass, property } = cc._decorator;

export const enum Tags {
	Player = 0,
	Tile,
	TileChild,
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

	//#region 游戏的数据-----------
	public static hardBase: number = 1.005;//难度的基数

	public static XLength: number;//x的大小
	public static xMinBorder: number;//x最小的边界
	public static xMaxBorder: number;//x最大的边界
	public static halfYBorder: number;//y的一半

	//#endregion

	//#region 跳板参数-----------
	public static startTileY: number = -750;//开始跳板的Y,第一个会加一个nextTileY
	public static recoveryTileY: number = 0;//跳板回收的Y

	public static allTileWeight = 0;//跳板的总权重,自动生成
	public static defaultNextTileY = 350;//正常下一个跳板的Y

	public static normalHorWeight = 1;//左右正常跳板的权重

	public static normalVerWeight = 0.20;//上下跳板的权重
	public static normalVerNext = 3;//上下跳板生成间隔
	public static horMoveClamp = 150;//上下跳板移动的距离
	public static normalVerNextTileY = 100;//上下移动跳板的Y

	public static moveHorWeight = 0.3;//左右移动跳板的权重
	public static moveHorNext = 2;//左右移动跳板的生成间隔
	public static horMoveSpeed = 200;//左右移动跳板移动的速度

	public static touchBreakWeight = 1000;//点击碎裂跳板的权重:0.2
	public static touchBreakNext = 0;//点击碎裂跳板的生成间隔:5
	public static touchBreakTime = 1;//点击碎裂跳板的裂开MoveBy的时间
	//#endregion


	@property(cc.Prefab)
	public tilePrefab: cc.Prefab = null;

	@property([cc.SpriteFrame])
	public tileSprites: cc.SpriteFrame[] = [];

	@property(cc.Prefab)
	public touchBreakPrefab: cc.Prefab = null;

	@property(cc.SpriteFrame)
	public touchBreakLeftSprites: cc.SpriteFrame = null;

	@property(cc.SpriteFrame)
	public touchBreakRightSprites: cc.SpriteFrame = null;

	onLoad() {
		GameData.instance = this;
		let world = cc.find("World").getComponent(cc.Canvas).designResolution;
		GameData.XLength = world.width;
		GameData.xMaxBorder = GameData.XLength / 2;
		GameData.xMinBorder = -GameData.xMaxBorder;
		GameData.halfYBorder = world.height / 2;
		GameData.recoveryTileY += GameData.halfYBorder;

		GameData.normalVerWeight += GameData.normalHorWeight;
		GameData.moveHorWeight += GameData.normalVerWeight;
		GameData.touchBreakWeight += GameData.moveHorWeight;
		GameData.allTileWeight = GameData.touchBreakWeight;
	}
}
