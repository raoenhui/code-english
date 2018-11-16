import React from 'react'
import * as superagent from 'superagent'

export default class extends React.Component {
  static async getInitialProps({req}) {
    if (req) {
      const {db} = req
      const list = await db.collection('Book').find().sort({createdAt: -1})
        .toArray()
      debugger
      return {list}
    }

    const {list} = await superagent.get('http://localhost:5001/api')
      .then(res => res.body)
    return {list}
  }

  constructor() {
    super()
    this.state = {formData: {author: '', title: '', cn: '', en: ''}}
  }

  setForm(prop) {
    return ev => {
      const state = this.state || {}
      const formData = state.formData || {}
      this.setState(Object.assign({}, state, {
        formData: Object.assign({}, formData, {
          [prop]: ev.target.value
        })
      }));
    }
  }

  isFormInvalid() {
    const state = this.state || {}
    const formData = state.formData || {}
    return !formData.cn || !formData.en
  }

  remove(_id) {
    return ev => {
      superagent.del(`http://localhost:5001/api/${_id}`)
        .then(() => {
          const state = this.state || {}
          const list = this.state.list || this.props.list || []
          this.setState(Object.assign({}, state, {
            list: list.filter(book => book._id !== _id)
          }))
        })
        .catch(error => console.error(error.stack))
    }
  }

  add() {
    return ev => {
      ev.preventDefault()
      const state = this.state || {}
      const formData = state.formData || {}
      this.setState(Object.assign({}, this.state, {
        formData: {author: '', title: '', cn: '', en: ''}
      }))
      superagent.post('http://localhost:5001/api', formData)
        .then(res => {
          const state = this.state || {}
          const list = this.state.list || this.props.list || []
          this.setState(Object.assign({}, state, {
            list: [res.body.book].concat(list)
          }))
        })
        .catch(error => console.error(error.stack))
    }
  }

  render() {
    const list = this.state.list || this.props.list
    const {formData} = this.state
    return (
      <div id="container">
        <h1>
          新单词
        </h1>
        <div id="input-book">
          <form onSubmit={this.add()}>
            <input
              type="text"
              onChange={this.setForm('en')}
              value={formData.en}
              placeholder="英文"/>
            <input
              type="text"
              onChange={this.setForm('cn')}
              value={formData.cn}
              placeholder="中文"/>
            <button disabled={this.isFormInvalid()}>Add</button>
          </form>
        </div>
        <h1>
          单词列表
        </h1>
        <div id="reading-list">
          <ul>
            {
              list.map(book => (
                <div key={book._id} className="line-con">
                  <span className="remove" onClick={this.remove(book._id)}>
                    X
                  </span>&nbsp;
                  <div className="en">
                    {book.en}
                  </div>
                  <div className="cn">
                    {book.cn}
                  </div>
                  <div className="description">
                    <i>{book.title}</i>
                  </div>
                </div>
              ))
            }
          </ul>
        </div>
        <style jsx>{`
          div {
            font-family: 'Helvetica', 'sans-serif';
          }
          #container {
            width: 800px;
            margin-left: auto;
            margin-right: auto;
          }
          h1 {
            color: #E971BE;
          }
          button {
            background-color: #E971BE;
            color: #ffffff;
            font-weight: bold;
            border: 0px;
            border-radius: 2px;
            padding: 5px;
            padding-left: 8px;
            padding-right: 8px;
            margin: 5px;
          }
          input {
            padding: 5px;
            border: 0px;
            background-color: #f0f0f0;
            margin: 5px;
          }
          .description {
            position: relative;
            top: -0.2em;
          }
          .remove {
            cursor: pointer;
            color: #E971BE;
            font-size: 1.5em;
          }
          .line-con{
            display:flex;
          }
          .cn{

          }
          .en{
            width: 150px;
          }
        `}</style>
      </div>
    )
  }
}
