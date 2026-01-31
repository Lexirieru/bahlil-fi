# IDRX

```sh
sui client call \
  --package 0xe341a2e605b65d6541540bb09571e95f739c567e208163ceec2f829457325e41 \
  --module idrx \
  --function new_currency  \
  --args 0xc
```

```sh
sui client call \
  --package 0xe341a2e605b65d6541540bb09571e95f739c567e208163ceec2f829457325e41 \
  --module idrx \
  --function mint \
  --args 0xf36530e96eb3d1968a18e17c8c22c470134c186d8d806497c18a3bf59eb3645a 100000000000 "0x695d89812bb4713409e3e78c3dafd8c0c44007edf6cc2f0a0f270f98a0fb95b9"
```