import React, { Component } from 'react'
import clientAuth from './clientAuth'
import './App.css'

class CanvasLoggedIn extends Component{
	constructor(props){
		super(props)

		this.state = {
			drawings: [],
			red: 0,
			green: 0,
			blue: 0,
			currentUser: null,
			editing: '',
			currentEditing: {},
			loading: true
		}
	}
	////////////////////////////////////////////////////////////////
	componentDidMount(){
		const currentUser = clientAuth.getCurrentUser()
		var c = this.refs.myCanvas
		var ctx = c.getContext('2d')
		ctx.strokeStyle= 'rgb('+ this.state.red+ ',' + this.state.green+ ',' + this.state.blue+ ')'
		ctx.lineWidth= 30
		ctx.lineJoin = ctx.lineCap = 'round'
		this.c = c
		this.mouse = {pressed: false}
		this.ctx = ctx
		clientAuth.getDrawing().then(res => {
			this.setState({
				drawings: res.data,
				currentUser: currentUser,
				loading: false
			})
		})
	}
	////////////////////////////////////////////////////////////////
	red(){
		this.setState({
			red: this.refs.r.value
		})
		this.ctx.strokeStyle= 'rgb('+ this.state.red+ ',' + this.state.green+ ',' + this.state.blue+ ')'
	}
	////////////////////////////////////////////////////////////////
	green(){
		this.setState({
			green: this.refs.g.value
		})
		this.ctx.strokeStyle= 'rgb('+ this.state.red+ ',' + this.state.green+ ',' + this.state.blue+ ')'
	}
	////////////////////////////////////////////////////////////////
	blue(){
		this.setState({
			blue: this.refs.b.value
		})
		this.ctx.strokeStyle= 'rgb('+ this.state.red+ ',' + this.state.green+ ',' + this.state.blue+ ')'
	}
	////////////////////////////////////////////////////////////////
	mousedown(evt){
		const boundingRect = this.refs.myCanvas.getBoundingClientRect()
		const x = evt.clientX- boundingRect.left
		const y = evt.clientY-boundingRect.top

		this.mouse = {pressed: true}
		this.ctx.beginPath()
		this.ctx.moveTo(x,y)
	}
	////////////////////////////////////////////////////////////////
	mousemove(evt){
		if(this.mouse.pressed){
			const boundingRect = this.refs.myCanvas.getBoundingClientRect()
			const x = evt.clientX- boundingRect.left
			const y = evt.clientY-boundingRect.top

			this.ctx.lineTo(x,y)
			this.ctx.stroke()
		}
	}
	////////////////////////////////////////////////////////////////
	_clearCanvas(){
		this.ctx.save()
		this.ctx.clearRect(0,0, this.c.width, this.c.height)
	}
	////////////////////////////////////////////////////////////////
	_saveCanvasToProf(){
		var gh = this.c.toDataURL('image/png')
		const newDrawing = {
			url: gh
		}
		clientAuth.addDrawing(newDrawing).then(res => {

			this.setState({
				drawings: [res.data.drawing, ...this.state.drawings]
			})
		})
		this.ctx.save()
		this.ctx.clearRect(0,0, this.c.width, this.c.height)
	}
	////////////////////////////////////////////////////////////////
	_deleteDrawing(id){
		clientAuth.deleteDrawing(id).then(res => {
			this.setState({
				drawings: this.state.drawings.filter((drawing) => {
					return drawing._id !== id
				})
			})
		})
	}
	////////////////////////////////////////////////////////////////
	_setEditDrawing(drawing){
		if(this.state.editing === drawing._id){
			this.setState({editing: null})
		} else{
			var background = new Image()
			background.src = drawing.url
			this.ctx.drawImage(background,0,0)
			this.setState({
				editing: drawing._id,
				currentEditing: drawing
			})
		}
	}
	////////////////////////////////////////////////////////////////
	_updateDrawing(){
		var gh = this.c.toDataURL('image/png')
		const updatedDrawing = {
			url: gh,
			id: this.state.editing
		}
		clientAuth.updateDrawing(updatedDrawing).then((res) => {
			console.log("response",res)
      const drawIndex = this.state.drawings.findIndex((drawing) => {
        return drawing._id === updatedDrawing.id
      })
      this.setState({
        drawings: [
          ...this.state.drawings.slice(0, drawIndex),
          res.data.drawing,
          ...this.state.drawings.slice(drawIndex + 1)
        ],
				editing: null,
				currentEditing: {},
      })
    })
		this.ctx.save()
		this.ctx.clearRect(0,0, this.c.width, this.c.height)
	}
	////////////////////////////////////////////////////////////////
	render(){
		////////////////////////////////////////////////////////////////
		const drawings = this.state.drawings.map((drawing, i) => {
			var editDraw = <p><button onClick={this._setEditDrawing.bind(this, drawing)}>Edit</button><button onClick={this._deleteDrawing.bind(this, drawing._id)}>Delete</button></p>
			return(
				<div key={i} className="Canvas-Images" >
				<img  src={drawing.url} alt="canvas-drawing" />
				{this.state.editing
				? <p></p>
				:editDraw
				}
			</div>
			)
		})
		////////////////////////////////////////////////////////////////
		var canvasButton
    if(this.state.editing){
      canvasButton = <button onClick={this._updateDrawing.bind(this)}>Update Your Master Piece</button>
    } else {
      canvasButton =<button onClick={this._saveCanvasToProf.bind(this)}>Save Your Master Piece</button>
    }
		////////////////////////////////////////////////////////////////
		const styles = {background: 'rgb('+ this.state.red+ ',' + this.state.green+ ',' + this.state.blue+ ')' }
		////////////////////////////////////////////////////////////////
		return(
			<div ref="canvasContainer">
				<div className="row">
					<div className="five columns">
						<h2>Canvas ToolKit</h2>
					<hr/>
						Brush Size: <input onChange={() => {this.ctx.lineWidth= this.refs.brushSize.value}} ref="brushSize" type="range" min="0.5" max="30"/>
						<br />
							Brush Color:
							<br/>
							<div className="preview-color" style={styles}> </div>
							R: <input onChange={this.red.bind(this)}ref="r" type="range" min="1" max="255"/>
							<br/>
							G: <input onChange={this.green.bind(this)}ref="g" type="range" min="1" max="255"/>
							<br/>
							B: <input onChange={this.blue.bind(this)}ref="b" type="range" min="1" max="255"/>
							<br />
							<button onClick={() => {this.ctx.strokeStyle = 'white'}} >Eraser</button>
							<button onClick={this._clearCanvas.bind(this)}> Clear</button>
							{canvasButton}
						</div>
				<div className="seven columns">
					<canvas onMouseDown={this.mousedown.bind(this)}
					onMouseMove={this.mousemove.bind(this)}
					onMouseUp={() => {this.mouse.pressed = false}}
					onMouseLeave={() => {this.mouse.pressed = false}}
					width='600'
					height='400'
					ref="myCanvas" className="Canvas-style"/>
				</div>
			</div>

			<h2>My Drawings: </h2>
			<hr/>
			{this.state.loading
				?<h1> Loading... </h1>
				:this.state.drawings.length === 0 ? "Oh no! You don't have any drawings yet, bummer.": drawings
			}


			</div>
			)
	}
}

export default CanvasLoggedIn
