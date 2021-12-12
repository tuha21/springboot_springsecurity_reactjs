import { size } from "lodash";
import { Component } from "react";
import { connect } from "react-redux"
import * as actions from '../../actions/index'

class ProductDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sizes: [],
            size: "",
            color: "",
            qty: 1,
        }
    }

    componentDidMount = () => {
        const {productDetails} = this.props.prodDetail
        const colors = this.renderColor()
        var sizes = productDetails.filter(val => {
            return val.qty > 0 && val.color === colors[0]
        }).map(val => {
            return val.size
        })
        this.setState({
            sizes
        })
        this.setState({
            color: colors[0],
            size: sizes[0]
        })
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onChangeColor = (event) => {
        const {productDetails} = this.props.prodDetail
        this.setState({
            [event.target.name]: event.target.value
        })
        var sizes = productDetails.filter(val => {
            return val.qty > 0 && val.color === event.target.value
        }).map(val => {
            return val.size
        })
        this.setState({
            sizes
        })
    }

    addToCart = (event) => {
        event.preventDefault();
        if(this.getQuantity(this.state.size, this.state.color) < Number(this.state.qty)){
            alert("Nhập lại số lượng");
            return
        }
        this.props.addToCart({
            prod: this.props.prodDetail,
            size: this.state.size,
            color: this.state.color,
            qty: Number(this.state.qty)
        })
    }

    renderColor = () => {
        var { productDetails } = this.props.prodDetail
        const colors = [...new Set(productDetails.map(val => {
            return val.color
        }))];
        return colors
    }

    getQuantity = () => {
        var { productDetails } = this.props.prodDetail
        const {size, color} = this.state
        const qty = productDetails.filter(val => {
            return val.size === size && val.color === color;
        }).map(val => val.qty)[0]
        return qty
    } 

    render() {
        var { prodDetail } = this.props
        const colors = this.renderColor().map((val, ind) => {
            return <option key={ind} value={val}>{val}</option>
        })
        const sizes = this.state.sizes.map((val, ind) => {
            return <option key={ind} value={val}>{val}</option>
        })
        return (
            <div>
                <div className="p-4">
                    <div className='row'>
                        <div className='col-md-2'></div>
                        <div className='col-md-4'>
                            <span className="mb-0">{"Sản phẩm/" + prodDetail.name.toLocaleUpperCase()}</span>
                        </div>

                        <div className='col-md-2'></div>
                    </div>

                </div>
                <div className="row m-0">
                    <div className="col-md-2" />
                    <div className="col-md-8">
                        <div className="row">
                            <div className='col-md-6'>
                                <img
                                    alt='i am a product'
                                    src={"http://localhost:8080/file/read/" + prodDetail.image}
                                    className='w-100' />
                            </div>
                            <div className="col-md-1"></div>
                            <div className='col-md-5'>
                                <div>
                                    <h5>{prodDetail.name}</h5>
                                    <div className='text-muted'>Mã SKU: {prodDetail.id}</div>
                                    <div className='mt-3 mb-3'>
                                    {prodDetail.sale > 0 ? <del className="text-secondary">{prodDetail.price}</del> : prodDetail.price}VNĐ
                                    <br></br>
                                    {prodDetail.sale > 0 ? <h5>{`${prodDetail.sale} VNĐ`}</h5> : ""}
                                    </div>

                                    <form>
                                        <div className='mb-3'>
                                            <div className='text-muted'>Chọn màu</div>
                                            <select className='form-control border-1 rounded-0 p-2'
                                                value={this.state.color}
                                                name='color'
                                                onChange={this.onChangeColor}
                                            >  
                                            {
                                               colors
                                            }
                                            </select>
                                        </div>
                                        <div className='mb-3'>
                                            <div className='text-muted'>Size</div>
                                            <select className='form-control border-1 rounded-0 p-2'
                                                value={this.state.size}
                                                name='size'
                                                onChange={this.onChange}
                                            >
                                                {sizes}
                                            </select>
                                        </div>
                                        <div className='mb-4'>
                                            <div className='text-muted'>Số lượng</div>
                                            <input type='number' className='form-control border-1 rounded-0 p-2 w-25'
                                                min={1}
                                                name='qty'
                                                value={this.state.qty}
                                                onChange={this.onChange}
                                            />
                                            <div className='text-danger'>Kho: {this.getQuantity()}</div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <button className="mt-3 p-0 pt-2 btn w-100 rounded-0" style={{ backgroundColor: '#A3C7BD' }}
                                                    onClick={this.addToCart}
                                                >
                                                    <h5 style={{ color: 'white' }}>Thêm vào giỏ hàng</h5>
                                                </button>
                                            </div>
                                            <div className='col-md-12'>
                                                <button className="mt-3 p-0 pt-2 btn w-100 rounded-0 bg-dark">
                                                    <h5 style={{ color: 'white' }}>Mua ngay</h5>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <br></br>
                                    <hr></hr>
                                    <div className='mt-3'>
                                        <h6 className='fw-bold'>Thông tin sản phẩm</h6>
                                        <p>
                                            I'm a product prodDetail. I'm a great place to add more information about your product such as sizing, material, care and cleaning instructions.
                                        </p>
                                        <hr></hr>
                                    </div>
                                    <div className='mt-3'>
                                        <h6 className='fw-bold'>Liên hệ</h6>
                                        <i className="bi bi-facebook pe-2" />
                                        <i className="bi bi-instagram pe-2" />
                                        <i className="bi bi-twitter pe-2" />
                                        <i className="bi bi-github pe-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        prodDetail: state.prodDetail
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addToCart: cartItem => {
            dispatch(actions.addToCart(cartItem))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);