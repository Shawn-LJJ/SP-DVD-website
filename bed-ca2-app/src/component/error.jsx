import HeaderDiv from './header';
import NavBar from './navBar';

function Error() {
    return (
        <div className='text-center m-5'>
            <p className='display-4'>The page does not exists.</p>
        </div>
    )
}

function ErrorPage() {
    return (
        <div>
            <HeaderDiv />
            <NavBar />
            <Error />
        </div>
    )
}

export default ErrorPage;