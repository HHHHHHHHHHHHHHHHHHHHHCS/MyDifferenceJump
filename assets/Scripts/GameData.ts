const { ccclass, property } = cc._decorator;

export const enum Tags {
	Player = 0,
	Tile,
	TileChild,
	Item,
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
 * 这里其实也可以用数组,这样TileManager那边也可以用数组
 *   代码看起来就简单很多,但是为了直观,没有用
 * 
 * */
export default class GameData extends cc.Component {

	public static Instance: GameData;

	//#region 游戏的数据-----------
	public hardBase: number = 1.005;//难度的基数

	public XLength: number;//x的大小
	public xMinBorder: number;//x最小的边界
	public xMaxBorder: number;//x最大的边界
	public halfYBorder: number;//y的一半

	//#endregion

	//#region 跳板参数-----------
	public startTileY: number = -750;//开始跳板的Y,第一个会加一个nextTileY
	public recoveryTileY: number = 0;//跳板回收的Y

	public allTileWeight = 0;//跳板的总权重,自动生成
	public defaultNextTileY = 350;//正常下一个跳板的Y

	public normalHorWeight = 1;//左右正常跳板的权重

	public normalVerWeight = 0.1;//上下跳板的权重
	public normalVerNext = 3;//上下跳板生成间隔
	public horMoveClamp = 150;//上下跳板移动的距离
	public normalVerNextTileY = 100;//上下移动跳板的Y

	public moveHorWeight = 0.3;//左右移动跳板的权重
	public moveHorNext = 2;//左右移动跳板的生成间隔
	public horMoveSpeed = 200;//左右移动跳板移动的速度

	public touchBreakWeight = 0.1;//点击碎裂跳板的权重
	public touchBreakNext = 5;//点击碎裂跳板的生成间隔
	public touchBreakTime = 1;//点击碎裂跳板的裂开MoveBy的时间

	public springHorWeight = 0.2;//点击碎裂跳板的权重
	public springHorNext = 5;//点击碎裂跳板的生成间隔
	public springHorForceScale = 1.5;//点击碎裂跳板的生成间隔

	public frozenHorWeight = 0.1;//冻结跳板的权重
	public frozenHorNext = 3;//冻结碎裂跳板的生成间隔
	public frozenHorTouchCount = 3;//冻结碎裂跳板的生成间隔
	//#endregion

	//#region 物品参数-----------
	public allItemWeight: number;//全部物品的权重
	public itemNoneWeight = 1;//物品不出的权重

	public hatWeight = 0.05;//帽子出现的权重
	public hatNext = 60;//帽子的出现间隔
	public hatFlySpeed = 1000;//帽子的飞行速度
	public hatFlyTime = 1.5;//帽子的飞行时间

	public rocketWeight = 0.01;//火箭出现的权重
	public rocketNext = 100;//火箭的出现间隔
	public rocketFlySpeed = 1500;//火箭的飞行速度
	public rocketFlyTime = 2;//火箭的飞行时间

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

	@property(cc.Prefab)
	public itemPrefab: cc.Prefab = null;

	onLoad() {
		GameData.Instance = this;
		let world = cc.find("World").getComponent(cc.Canvas).designResolution;
		this.XLength = world.width;
		this.xMaxBorder = this.XLength / 2;
		this.xMinBorder = -this.xMaxBorder;
		this.halfYBorder = world.height / 2;
		this.recoveryTileY += this.halfYBorder;

		this.normalVerWeight += this.normalHorWeight;
		this.moveHorWeight += this.normalVerWeight;
		this.touchBreakWeight += this.moveHorWeight;
		this.springHorWeight += this.touchBreakWeight;
		this.frozenHorWeight += this.springHorWeight;
		this.allTileWeight = this.frozenHorWeight;

		this.hatWeight += this.itemNoneWeight;
		this.rocketWeight += this.hatWeight;
		this.allItemWeight = this.rocketWeight;
	}
}
