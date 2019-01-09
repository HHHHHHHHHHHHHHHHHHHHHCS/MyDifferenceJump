
const { ccclass, property } = cc._decorator

@ccclass
export default class TargetFollow extends cc.Component {
	@property({ type: cc.Node, visible: true })
	private target: cc.Node = null;

	@property({ type: cc.Float, visible: true })
	private dampTime: number = 0.5;

	private moveAct: cc.Action;
	private lastPosY: number;

	onLoad() {
		this.lastPosY = this.node.y;
	}

	update(dt: number) {
		if (this.target.y > this.lastPosY) {
			this.lastPosY = this.target.y
			let offset = this.target.y - this.node.y;
			this.moveAct = cc.moveBy(this.dampTime, cc.v2(0, offset)).easing(cc.easeOut(3.0));
			this.node.runAction(this.moveAct);
		}
	}
}