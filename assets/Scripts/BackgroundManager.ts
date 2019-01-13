import MyU from "./My/MyU";

const { ccclass, property } = cc._decorator;

@ccclass
/** 背景系统管理用 */
export default class BackgroundManager extends cc.Component {

	private backgrounds: cc.Node[];

	private offsetPosY: number;
	private recoveryPosY: number;
	private highBgY: number = 0;

	onLoad() {
		this.backgrounds = this.node.children;
		this.backgrounds.forEach(item => {
			if (item.y > this.highBgY) {
				this.highBgY = item.y;
			}
		});
		this.offsetPosY = this.backgrounds[0].width;//因为我们的背景这里是旋转过的
		this.recoveryPosY = this.offsetPosY * 1.5;
	}

	public OnRecovery(cameraPosY: number) {
		let recoveryY = cameraPosY - this.recoveryPosY;
		this.backgrounds.forEach(item => {
			if (item.y < recoveryY) {
				this.highBgY += this.offsetPosY;
				item.y = this.highBgY;
			}
		});
	}
}
