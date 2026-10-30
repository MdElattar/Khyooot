import MainCavalary from "./MAINCAVARLY.jpg";
import Cavalary from "./CAVARLY.jpg";
import Cavalary1 from "./CAVARLY1.jpg";
import Cavalary4 from "./CAVARLY4.jpg";
import Cavalary5 from "./CAVARLY5.jpg";
import Cavalary3 from "./CAVARLY3.jpg";
import Cavalary2 from "./CAVARLY2.jpg";
import Arabian from "./Arabian Weave.jpeg"
import Arabian1 from "./Arabian Weave1.jpeg"
import Arabian2 from "./Arabian Weave2.jpeg"
import Arabian3 from "./Arabian Weave3.jpeg"
import ArabianB1 from "./Arabian Black1.jpeg"
import ArabianB2 from "./Arabian Black2.jpeg"
import ArabianBB from "./ArabianBurghandy.jpeg"
import Babytee from "./Babe Tee.jpeg"
import Babytee1 from "./Babe Tee1.jpeg"
import Babytee2 from "./Babe Tee2.jpeg"
import Babytee3 from "./Babe Tee3.jpeg"
import Balaclava from "./Balaclava.jpeg"
import Balaclava1 from "./Balaclava1.jpeg"
import Balaclava2 from "./Balaclava2.jpeg"
import Balaclava3 from "./Balaclava3.jpeg"
import tshirt from "./tshirt.jpeg"
import tshirt1 from "./tshirt1.jpeg"
import tshirt2 from "./tshirt2.jpeg"
import tshirt3 from "./tshirt3.jpeg"
import tshirtt from "./tshirtt.jpeg"
import tshirtt1 from "./tshirtt1.jpeg"
import tshirtt2 from "./tshirtt2.jpeg"
import tshirtt3 from "./tshirtt3.jpeg"





import logo from './logo.png'
import hero_img from './hero_img.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'
import bag from "./bag.png";
import user from "./userr.png";
import menu from "./menu (1).png";
import plus from './plus.png'
import minus from './minus.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon,
    bag,
    user,
    menu,
    plus,
    minus
}

export const products = [
    
    {
        _id: "aaaaa",
        name: "ARABIAN WEAVE",
        description: "W25",
        price: "899",
        image: [Arabian,,Arabian3,ArabianB1,ArabianBB],
        category: "Unisex",
        subCategory: "Hoddies",
        colors: ["Black", "Baby blue", "Burgundy"],
        sizes: ["XS","S", "M", "L"],
        date: 1716621345448,
        bestseller: true
    },
        {
        _id: "aaaab",
        name: "CAVARLY HODDIE",
        discription:"W25",
        price: 650,
        lastPrice: 950,
        image: [MainCavalary,Cavalary3,Cavalary5,Cavalary4],
        category: "Unisex",
        subCategory: "Hoddies",
        colors: [ "Black", "Pink"],
        sizes: ["XS","S", "M", "L"],
        date: 1716621345448,
        bestseller: false,
        collection:"winter"
    },
   
    {
        _id: "aaaac",
        name: "BABE TEE",
        description: "S25",
        price: 399,
        image: [Babytee,Babytee1,Babytee2,Babytee3],
        category: "Women",
        subCategory: "Babytees",
        colors: ["Black", "White"],
        sizes: ["XS","S", "M", "L"],
        // date: 1716234545448,
        bestseller: true
    },
    {
        _id: "aaaad",
        name: "BLACKLAVA",
        description: "W25",
        price: 899,
        image: [Balaclava,Balaclava1,Balaclava2,Balaclava3],
        category: "Unisex",
        subCategory: "Hoddies",
        colors: [ "Black"],
        sizes: ["XS","S", "M", "L"],
        // date: 1716234545448,
        bestseller: true
    },

    {
        _id: "aaaae",
        name: "KHYOOT T-shirt",
        description: "S25",
        price: 699,
        image: [tshirt,tshirt1,tshirt2,tshirt3],
        category: "Unisex",
        subCategory: "TShirts",
        colors: ["Black" , "Babyblue" , "pink"],
        sizes: ["XS","S", "M", "L"],
        date: 1716622345448,
        bestseller: true
    },
    {
        _id: "aaaaf",
        name: "KHYOOT T-shirt",
        description: "S25",
        price: 699,
        image: [tshirtt,tshirtt1,tshirtt2,tshirtt3],
        category: "Unisex",
        subCategory: "TShirts",
        colors: ["Black" , "White", "Babyblue" , "pink"],
        sizes: ["XS","S", "M", "L"],
        date: 1716622345448,
        bestseller: true
    },
   
    

]