import { View } from 'lucide-react-native';
import React, { FC } from 'react';
import { Image, ImageBackground } from 'react-native';
/// @ts-ignore
import DefaultImage from '../assets/images/dw.png';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;

interface Socket_ProviderProps {
    children?: React.ReactNode;
    url: string;
    backgroundColor?: string;
    defaultWallpaper?: boolean;

}
const Wallpaper_Provider: FC<Socket_ProviderProps> = ({
    children,
    url,
    backgroundColor,
    defaultWallpaper
}) => {

    return (
        <>
            <ImageBackground
                source={{
                    uri: defaultWallpaper ? DEFAULT_IMAGE : url
                }}
                style={{
                    flex: 1,
                    backgroundColor: backgroundColor,
                }}
            >
                {children}
            </ImageBackground>
        </>
    );
};

export default Wallpaper_Provider;