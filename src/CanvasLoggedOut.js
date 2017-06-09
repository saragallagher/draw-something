import React, { Component } from 'react'
import './App.css'

class CanvasLoggedOut extends Component{
	componentDidMount(){
		var c = this.refs.myCanvas
		var ctx = c.getContext('2d')
		ctx.strokeStyle= 'black'
		ctx.lineWidth= 10
		ctx.lineJoin = ctx.lineCap = 'round'
		this.c = c
		this.mouse = {pressed: false}
		this.ctx = ctx
	}

	mousedown(evt){
		const boundingRect = this.refs.myCanvas.getBoundingClientRect()
		const x = evt.clientX- boundingRect.left
		const y = evt.clientY-boundingRect.top

		this.mouse = {pressed: true}
		this.ctx.beginPath()
		this.ctx.moveTo(x,y)
	}

	mousemove(evt){
		if(this.mouse.pressed){
			const boundingRect = this.refs.myCanvas.getBoundingClientRect()
			const x = evt.clientX- boundingRect.left
			const y = evt.clientY-boundingRect.top

			this.ctx.lineTo(x,y)
			this.ctx.stroke()
		}
	}
	_clearCanvas(){
		this.ctx.save()
		this.ctx.clearRect(0,0, this.c.width, this.c.height)
	}

	render(){
		return(
			<div className="row">
				<div className="five columns">
					<h3>Welcome!</h3> <h4>If you want to access different brush sizes, colors, or if you want to save your masterpieces; create an account or login!</h4>
				</div>
				<div className="seven columns">
			<div ref="canvasContainer">
			<canvas
			onMouseDown={this.mousedown.bind(this)}
			onMouseMove={this.mousemove.bind(this)}
			onMouseUp={() => {this.mouse.pressed = false}}
			onMouseLeave={() => {this.mouse.pressed = false}}
			width='600'
			height='400'
			ref="myCanvas" className="Canvas-style logged-out"/>
			<button className="logged-out" onClick={this._clearCanvas.bind(this)}> Clear</button>

			</div>
			</div>
		</div>
			)
	}
}

export default CanvasLoggedOut
