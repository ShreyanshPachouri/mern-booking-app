import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"
import SearchBar from "../components/SearchBar"

interface Props{
    children: React.ReactNode
}
//This is a typescript interface named Props which has a property children which will be of type React.ReactNode. It means that children can be any React element.

const Layout = ({children} : Props) => {
    //children should be of type props
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="container mx-auto">
                <SearchBar />
            </div>
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout