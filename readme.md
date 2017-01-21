# necropsy

dissect dead node service core dumps with llnode using a single command 

## Usage

```sh
$ npm i -g necropsy
$ necropsy setup # if you need llnode and lldb
$ necropsy [node-binary] core-file
```

## Platforms

Linux and macOS

## Requirements

* We need lldb and llnode to be installed, `necropsy setup` has you covered
* Python should be installed (python scripts are used to get memory ranges)

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)

## License

MIT

