import "./footer.css"

function Footer(){
    return(
        <div className="footer" >
            <p className="cc">© {new Date().getFullYear()} John Adhikari</p>
        </div>
    );
}

export default Footer