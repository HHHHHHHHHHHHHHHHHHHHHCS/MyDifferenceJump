interface Array<T> {
	IndexOf(t: T): number;
	Remove(t: T): void;
}


Array.prototype.IndexOf = function (val) {
	for (let i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};



Array.prototype.Remove = function (val) {
	var index = this.IndexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

