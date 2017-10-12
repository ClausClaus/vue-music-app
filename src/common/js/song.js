import {getLyric} from "api/song";
import {ERR_OK} from "api/config";

export default class Song {
  /**
   * Creates an instance of Song.
   * @param {any} { id, mid, singer, name, album, duration, image, url }
   * @memberof Song
   * id [ 歌曲id ]
   * mid [ 歌曲的mid ]
   * singer [ 歌曲列表 ]
   * name [ 歌曲名称 ]
   * album [ 专辑名称 ]
   * duration [ 歌曲的长度 ]
   * image [ 歌曲图片 ]
   * url [ 歌曲的请求地址 ]
   */
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
  /*
  *   通过ajax请求歌词数据，存入到歌曲类对象中，实例化时被继承
  * */
  getLyric() {
    getLyric(this.mid).then((res) => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric;
        // console.log(this.lyric);
      }
    })
  }
}

/**
 * 歌曲工厂实例
 *
 * @export
 * @param {any} musicData
 * @returns
 */
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
  })
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return;
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join('/')
}
