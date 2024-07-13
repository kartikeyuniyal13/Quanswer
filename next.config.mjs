/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions: true,
        mdxRs: true,
        serverComponentsExternalPackages:['mongoose']
    },
    images:{
        remotePatterns:[
            {
                protocol: 'https',  
                hostname: '*'  //allowing all,we can be specific 
            },
            {
                protocol: 'http',  
                hostname: '*'  //allowing all,we can be specific 
            }
        ]
    }

};

export default nextConfig;
