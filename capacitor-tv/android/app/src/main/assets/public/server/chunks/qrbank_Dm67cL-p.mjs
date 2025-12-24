const qrBank = new Proxy({"src":"/_astro/qrbank.Dcdx0zTi.png","width":921,"height":1053,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "E:/tramphim/tramphim-frontend/src/assets/qrbank.png";
							}
							
							return target[name];
						}
					});

export { qrBank as q };
