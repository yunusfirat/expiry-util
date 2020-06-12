import Constants from "expo-constants";
import { ImageRequest, SizeRequest } from "../constants/Dtos";
import HttpClient from "../services/HttpClient";

export default class Utility {
    private static readonly EVICTION_FREQUENCY: string = Constants.manifest.extra.imageCacheEvictionFrequency;

    static convertImageToDto(uri: string): ImageRequest {
        var collection = uri.split('/');
        var nameAndFormat = collection[collection.length - 1];
        var parts = nameAndFormat.split('.');
        return new ImageRequest(nameAndFormat, 'image/' + parts[1], uri);
    }

    static calculateURLCacheValue(evictionFrequency: string): string {
        var now = new Date();
        switch (evictionFrequency) {
            case 'daily':   return now.toLocaleDateString();
            case 'yearly':  return now.getFullYear().toString();
            default:        return now.toISOString();
        }
    }

    static remoteURI(_localURI: string, goodId: number, size: SizeRequest): string {
      return HttpClient.findImageURL(goodId, size, {key: 'cache', value : Utility.calculateURLCacheValue(Utility.EVICTION_FREQUENCY)});
    }

    static assignChildState<S extends any>(path: string, value: Object, previousState: S): S {
        var pieces = path.split(".");
        var newState = Object.assign({}, previousState);
        var current = newState;
        for (var i = 0; i < pieces.length - 1; ++i) {
            var piece = pieces[i];
            if ("[object Object]" === current[piece].toString()) {
                current[piece] = Object.assign({}, current[piece]);
            } else if (typeof "object" === current[piece] /* array */) {
                current[piece] = current[piece].concat();
            }
            current = current[piece];
        }
        current[pieces[i]] = value;
        return newState;
    }
}