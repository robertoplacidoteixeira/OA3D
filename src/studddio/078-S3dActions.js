class S3dActions extends RptCommonAncestor {

	afterPrepare() {
		super.afterPrepare();
		this.actionLL = new RptLinkedList();
	}

	exec() {
		var node = this.actionLL.first;
		while (node) {
			node.object.exec(); 
			node = node.next;
		}
	}

	removeUnusedActions() {
		/*
		var node = this.actionLL.first;
		while (node) {
			var action = node.object;
			if (action) {
				var result = action();
				if (!result) {
					this.removeAction();
				}
			}
			node = node.next;
		}
		*/
	}

	insert(action_) {
	   this.actionLL.insert(actionLL.linkedNodeCount,action_);
	}
	
	deleteAction(index) {
	   this.actionLL.delete(index);
	}
	add(data_) {
		this.actionLL.insert(this.actionLL.linkedNodeCount,new S3dAction(data_));
	}

	move(data_) {
		data_.property = "position";
		this.add(data_);
	}

	moveBy(target_,time_) {
	   this.move({toby: "by", target: target_, time: time_});
	}

	moveTo(target_,time_) {
	   this.move({toby: "to", target: target_, time: time_});
	}

	rotate(data_) {
		data_.property = "rotation";
		this.add(data_);
	}

	rotateBy(data_) {
		rotate({toby: "by", target: target_, time: time_})
	}

	rotateTo(data_) {
		rotate({toby: "to", target: target_, time: time_})
	}
}
