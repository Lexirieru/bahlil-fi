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

# Mock SUI

```sh
sui client call \
  --package 0x801cf1f2541e9db0c3aab243793a7318ce84c5ac67716237225d4d56d4b613f7 \
  --module mocksui \
  --function new_currency  \
  --args 0xc | tee logs/new_currency.txt
```

```sh
sui client call \
  --package 0x801cf1f2541e9db0c3aab243793a7318ce84c5ac67716237225d4d56d4b613f7 \
  --module mocksui \
  --function mint \
  --args 0x4599b4116df5527d3c4a8ee4e572935715f79d0121efe93ddead7cf20faca9eb 100000000000 "0x695d89812bb4713409e3e78c3dafd8c0c44007edf6cc2f0a0f270f98a0fb95b9"
```