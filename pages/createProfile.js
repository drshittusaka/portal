const createProfile = () => {
    return (
        <div>
            Enter
        </div>
    );
}

export const getStaticProps = async (ctx) => {


    return {
        props:{
            data:null
        }
    }
}

export const getStaticPaths = async () => {


    return {
        paths:[],
        fallback:false
    }
}

export default createProfile;