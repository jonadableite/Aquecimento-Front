import { useDarkMode } from "@/hooks/useDarkMode";
import { toast } from "react-hot-toast";

/* eslint-disable react/prop-types */
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
	Activity,
	Layers,
	Plus,
	Power,
	RefreshCw,
	Settings,
	Trash2,
	Wifi,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import TypebotConfigForm from "../components/TypebotConfigForm";

const API_BASE_URL = "http://localhost:3050";
const API_URL = "https://evo.whatlead.com.br";
const API_KEY = "429683C4C977415CAAFCCE10F7D57E11";

const ConnectionStatus = ({ connected }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.8 }}
		animate={{ opacity: 1, scale: 1 }}
		className={`
      inline-flex items-center
      px-4 py-1.5
      rounded-full
      backdrop-blur-md
      ${
				connected
					? "bg-green-400/10 text-green-500 border border-green-500/20"
					: "bg-red-400/10 text-red-500 border border-red-500/20"
			}
    `}
	>
		<Activity className={`w-3 h-3 mr-2 ${connected ? "animate-pulse" : ""}`} />
		<span className="text-xs font-semibold">
			{connected ? "Online" : "Offline"}
		</span>
	</motion.div>
);

const InstanceCard = ({
	instance,
	onReconnect,
	onLogout,
	onDelete,
	onConfigureTypebot,
	deletingInstance,
}) => {
	const isConnected = instance.connectionStatus === "open";
	const hasTypebot = !!instance.typebot;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="relative backdrop-blur-lg bg-gradient-to-br from-whatsapp-profundo/80 to-whatsapp-cinza/50 rounded-3xl p-6 shadow-2xl border border-whatsapp-green/30 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-whatsapp-green/20 hover:scale-105"
		>
			{/* Efeito de gradiente de fundo */}
			<div className="absolute inset-0 bg-gradient-to-tr from-whatsapp-eletrico/10 to-whatsapp-luminoso/5 opacity-50" />

			<div className="relative z-10 space-y-6">
				{/* Cabeçalho do Card */}
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<FaWhatsapp
							className={`w-10 h-10 p-2 rounded-full ${
								isConnected
									? "text-whatsapp-green bg-whatsapp-green/20"
									: "text-red-500 bg-red-500/20"
							}`}
						/>
						<div>
							<h3 className="text-xl font-bold text-whatsapp-branco">
								{instance.instanceName}
							</h3>
							<p className="text-sm text-whatsapp-cinzaClaro">
								{instance.phoneNumber}
							</p>
						</div>
					</div>
					<ConnectionStatus connected={isConnected} />
				</div>

				{/* Botões de Ação */}
				<div className="grid grid-cols-2 gap-4">
					{/* Botão de Conectar (condicional) */}
					{!isConnected && (
						<motion.button
							onClick={() => onReconnect(instance.instanceName)}
							whileHover={{
								scale: 1.02,
								boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
							}}
							whileTap={{ scale: 0.98 }}
							className="col-span-2 flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<Wifi className="mr-2 w-5 h-5" /> Conectar
						</motion.button>
					)}

					{/* Botão de Logout */}
					<motion.button
						onClick={() => onLogout(instance.instanceName)}
						whileHover={{
							scale: 1.02,
							boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
						}}
						whileTap={{ scale: 0.98 }}
						className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-4 rounded-xl shadow-lg transition-all duration-300"
					>
						<Power className="mr-2 w-5 h-5" /> Logout
					</motion.button>

					{/* Botão do Typebot */}
					<motion.button
						onClick={() => onConfigureTypebot(instance)}
						whileHover={{
							scale: 1.02,
							boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
						}}
						whileTap={{ scale: 0.98 }}
						className={`flex items-center justify-center py-3 px-4 rounded-xl shadow-lg transition-all duration-300 ${
							hasTypebot
								? "bg-gradient-to-r from-blue-500 to-blue-600"
								: "bg-gradient-to-r from-whatsapp-eletrico to-whatsapp-green"
						} text-white`}
					>
						<Settings className="mr-2 w-5 h-5" />
						{hasTypebot ? "Editar Fluxo" : "Adicionar Fluxo"}
					</motion.button>

					{/* Botão de Excluir */}
					<motion.button
						onClick={() => onDelete(instance.instanceId, instance.instanceName)}
						disabled={deletingInstance === instance.instanceId}
						whileHover={{
							scale: 1.02,
							boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
						}}
						whileTap={{ scale: 0.98 }}
						className="col-span-2 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{deletingInstance === instance.instanceId ? (
							<div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-2" />
						) : (
							<Trash2 className="mr-2 w-5 h-5" />
						)}
						{deletingInstance === instance.instanceId
							? "Excluindo..."
							: "Excluir"}
					</motion.button>
				</div>

				{/* Informações do Typebot */}
				{hasTypebot && (
					<div className="mt-4 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-whatsapp-green/20">
						<div className="flex items-center space-x-2 mb-2">
							<div className="w-2 h-2 bg-whatsapp-green rounded-full animate-pulse" />
							<p className="text-sm font-semibold text-whatsapp-green">
								Fluxo Ativo
							</p>
						</div>
						<p className="text-sm text-whatsapp-branco">
							{instance.typebot.typebot}
						</p>
						{instance.typebot.description && (
							<p className="text-xs text-whatsapp-cinzaClaro mt-1">
								{instance.typebot.description}
							</p>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
};

const Numeros = () => {
	const [isDarkMode] = useDarkMode();
	const [instances, setInstances] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPlan, setCurrentPlan] = useState("");
	const [instanceLimit, setInstanceLimit] = useState(0);
	const [remainingSlots, setRemainingSlots] = useState(0);
	const [qrCode, setQrCode] = useState(null);
	const [qrCodeError, setQrCodeError] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newInstaceName, setNewInstaceName] = useState("");
	const [showQrCodeModal, setShowQrCodeModal] = useState(false);
	const [selectedInstance, setSelectedInstance] = useState(null);
	const [showTypebotConfig, setShowTypebotConfig] = useState(false);
	const [deletingInstance, setDeletingInstance] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await fetchInstances();
			toast.success("Dados atualizados com sucesso!");
		} catch (error) {
			console.error("Erro ao atualizar dados:", error);
			toast.error("Erro ao atualizar dados");
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleError = (error) => {
		if (error.response) {
			const status = error.response.status;
			if (status === 401) {
				toast.error("Sessão expirada. Faça login novamente.");
				window.location.href = "/login";
			} else if (status === 403) {
				toast.error("Você não tem permissão para acessar este recurso.");
			} else {
				toast.error(
					error.response.data?.message || "Erro ao carregar instâncias",
				);
			}
		} else if (error.request) {
			toast.error("Sem resposta do servidor. Verifique sua conexão.");
		} else {
			toast.error("Erro ao configurar a requisição.");
		}
	};

	const fetchInstances = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");

			if (!token) {
				toast.error("Token de autenticação não encontrado");
				window.location.href = "/login";
				return;
			}

			const response = await axios.get(`${API_BASE_URL}/api/instances`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Dados das instâncias:", response.data);

			const {
				instances: instancesData,
				currentPlan,
				instanceLimit,
				remainingSlots,
			} = response.data;

			setInstances(instancesData || []);
			setCurrentPlan(currentPlan || "");
			setInstanceLimit(instanceLimit || 0);
			setRemainingSlots(remainingSlots || 0);
		} catch (error) {
			console.error("Erro na busca de instâncias:", error);
			handleError(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateInstance = async () => {
		if (remainingSlots <= 0) {
			toast.error(`Limite de instâncias atingido para o plano ${currentPlan}`);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`${API_BASE_URL}/api/instances/create`,
				{
					instanceName: newInstaceName,
					qrcode: true,
					integration: "WHATSAPP-BAILEYS",
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			console.log("Resposta da API:", response.data);
			const { qrcode, instance } = response.data;

			// Ajuste o tratamento do QR code
			if (qrcode && (typeof qrcode === "string" || qrcode.base64)) {
				setQrCode({
					base64: typeof qrcode === "string" ? qrcode : qrcode.base64,
				});
				setShowQrCodeModal(true);
				toast.success(
					"Instância criada com sucesso! Escaneie o QR Code para conectar.",
				);
				setIsModalOpen(false);

				// Inicia o monitoramento do status
				let attempts = 0;
				const maxAttempts = 60;

				const intervalId = setInterval(async () => {
					try {
						attempts++;
						console.log(
							`Verificando status da nova instância (tentativa ${attempts})`,
						);

						const statusResponse = await axios.get(
							`${API_URL}/instance/connectionState/${newInstaceName}`,
							{
								headers: {
									apikey: API_KEY,
								},
							},
						);

						console.log("Status response:", statusResponse.data);
						const currentStatus =
							statusResponse.data?.instance?.connectionStatus ||
							statusResponse.data?.instance?.state;

						console.log("Current status:", currentStatus);

						if (currentStatus === "open") {
							try {
								// Atualiza o status no banco local
								await axios.put(
									`${API_BASE_URL}/api/instances/instance/${instance.id}/connection-status`,
									{
										connectionStatus: "open",
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
										},
									},
								);

								console.log("Status atualizado para open no banco local");
								toast.success("Instância conectada com sucesso!");
								setShowQrCodeModal(false);
								await fetchInstances();
								clearInterval(intervalId);
							} catch (updateError) {
								console.error("Erro ao atualizar status:", updateError);
								toast.error("Erro ao atualizar status da instância");
							}
						} else if (attempts >= maxAttempts) {
							toast.error("Tempo limite de conexão excedido");
							clearInterval(intervalId);
						}
					} catch (error) {
						console.error("Erro ao verificar status:", error);
						if (attempts >= maxAttempts) {
							clearInterval(intervalId);
						}
					}
				}, 2000);

				// Limpa o intervalo após o tempo máximo
				setTimeout(() => {
					clearInterval(intervalId);
				}, 120000);
			} else {
				console.error("Formato de QR code inválido:", qrcode);
				toast.error("Erro ao processar QR code");
				return;
			}

			await fetchInstances();
		} catch (error) {
			console.error("Erro ao criar instância:", error);
			const errorMessage =
				error.response?.data?.message || "Erro desconhecido ao criar instância";
			toast.error(errorMessage);
		}
	};

	const handleReconnectInstance = async (instanceName) => {
		try {
			// Tenta conectar e obter o QR code
			const response = await axios.get(
				`${API_URL}/instance/connect/${instanceName}`,
				{
					headers: {
						apikey: API_KEY,
					},
				},
			);

			if (response.status === 200) {
				const qrCodeData = response.data;

				if (qrCodeData && (qrCodeData.base64 || qrCodeData.code)) {
					setQrCode({
						base64:
							qrCodeData.base64 || `data:image/png;base64,${qrCodeData.code}`,
						pairingCode: qrCodeData.pairingCode,
					});
					setShowQrCodeModal(true);
					toast.success("Escaneie o QR Code para conectar");

					let attempts = 0;
					const maxAttempts = 60;

					// Inicia o monitoramento
					const intervalId = setInterval(async () => {
						try {
							attempts++;
							console.log(`Verificando status (tentativa ${attempts})`);

							const statusResponse = await axios.get(
								`${API_URL}/instance/connectionState/${instanceName}`,
								{
									headers: {
										apikey: API_KEY,
									},
								},
							);

							console.log("Status response:", statusResponse.data);
							const currentStatus =
								statusResponse.data?.instance?.connectionStatus ||
								statusResponse.data?.instance?.state;

							console.log("Current status:", currentStatus);

							if (currentStatus === "open") {
								const token = localStorage.getItem("token");
								const instanceToUpdate = instances.find(
									(instance) => instance.instanceName === instanceName,
								);

								if (instanceToUpdate) {
									try {
										const updateResponse = await axios.put(
											`${API_BASE_URL}/api/instances/instance/${instanceToUpdate.instanceId}/connection-status`,
											{
												connectionStatus: "open",
											},
											{
												headers: {
													Authorization: `Bearer ${token}`,
												},
											},
										);

										console.log("Update response:", updateResponse.data);
										toast.success("Instância conectada com sucesso!");
										setShowQrCodeModal(false);
										await fetchInstances();
										clearInterval(intervalId);
									} catch (updateError) {
										console.error("Erro ao atualizar status:", updateError);
										console.log(
											"Update error details:",
											updateError.response?.data,
										);
										toast.error("Erro ao atualizar status da instância");
									}
								}
							} else if (attempts >= maxAttempts) {
								toast.error("Tempo limite de conexão excedido");
								clearInterval(intervalId);
							}
						} catch (error) {
							console.error("Erro ao verificar status:", error);
							if (attempts >= maxAttempts) {
								clearInterval(intervalId);
							}
						}
					}, 2000);

					// Garante que o intervalo será limpo após o tempo máximo
					setTimeout(() => {
						clearInterval(intervalId);
					}, 120000);
				} else {
					console.error("QR code não encontrado na resposta:", qrCodeData);
					toast.error("Erro ao obter QR code para reconexão");
				}
			} else {
				toast.error("Erro ao tentar reconectar a instância");
			}
		} catch (error) {
			console.error("Erro ao reconectar instância:", error);
			handleError(error);
		}
	};

	const handleLogoutInstance = async (instanceName) => {
		try {
			// Primeiro faz logout na API externa
			await axios.delete(`${API_URL}/instance/logout/${instanceName}`, {
				headers: {
					apikey: API_KEY,
				},
			});

			// Após logout bem-sucedido, atualiza o status no banco local
			const token = localStorage.getItem("token");
			const instanceToUpdate = instances.find(
				(instance) => instance.instanceName === instanceName,
			);

			if (instanceToUpdate) {
				try {
					await axios.put(
						`${API_BASE_URL}/api/instances/instance/${instanceToUpdate.instanceId}/connection-status`,
						{
							connectionStatus: "close",
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						},
					);

					toast.success("Instância desconectada com sucesso!");
					await fetchInstances(); // Recarrega os dados atualizados
				} catch (updateError) {
					console.error(
						"Erro ao atualizar status no banco local:",
						updateError,
					);
					toast.error("Erro ao atualizar status da instância no banco local");
				}
			}
		} catch (error) {
			console.error("Erro ao desconectar instância:", error);
			toast.error(
				error.response?.data?.message || "Erro ao desconectar instância",
			);
		}
	};

	const handleConfigureTypebot = (instance) => {
		setSelectedInstance(instance);
		setShowTypebotConfig(true);
	};

	const handleUpdateTypebotConfig = async (config) => {
		try {
			const token = localStorage.getItem("token");

			// Primeiro, atualiza no banco local
			await axios.put(
				`${API_BASE_URL}/api/instances/instance/${selectedInstance.instanceId}/typebot`,
				{
					typebot: {
						...config,
						description: config.description, // Garante que o campo description está sendo enviado
					},
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			// Depois, atualiza na API externa
			await axios.post(
				`${API_URL}/typebot/create/${selectedInstance.instanceName}`,
				{
					...config,
					description: config.description, // Garante que o campo description está sendo enviado
				},
				{
					headers: {
						apikey: API_KEY,
						"Content-Type": "application/json",
					},
				},
			);

			toast.success("Configurações do Typebot atualizadas com sucesso!");
			setShowTypebotConfig(false);
			await fetchInstances();
		} catch (error) {
			console.error("Erro ao atualizar configurações do Typebot:", error);
			if (error.response?.data?.error) {
				toast.error(`Erro: ${error.response.data.error}`);
			} else {
				toast.error("Erro ao atualizar configurações do Typebot");
			}
		}
	};

	const handleDeleteTypebotConfig = async (instanceId, instanceName) => {
		try {
			const token = localStorage.getItem("token");

			// Confirma com o usuário
			if (!window.confirm("Tem certeza que deseja remover este fluxo?")) {
				return;
			}

			// Primeiro, desativa o typebot na API externa
			await axios.post(
				`${API_URL}/typebot/create/${instanceName}`,
				{
					enabled: false,
					url: "",
					typebot: "",
					expire: 0,
					keywordFinish: "#EXIT",
					delayMessage: 1000,
					unknownMessage: "",
					triggerType: "none",
					triggerOperator: "contains",
					triggerValue: "",
					listeningFromMe: false,
					stopBotFromMe: false,
					keepOpen: false,
					debounceTime: 10,
				},
				{
					headers: {
						apikey: API_KEY,
						"Content-Type": "application/json",
					},
				},
			);

			// Depois, atualiza no banco local
			await axios.put(
				`${API_BASE_URL}/api/instances/instance/${instanceId}/typebot`,
				{
					typebot: {
						enabled: false,
						url: "",
						typebot: "",
						expire: 0,
						keywordFinish: "#EXIT",
						delayMessage: 1000,
						unknownMessage: "",
						triggerType: "none",
						triggerOperator: "contains",
						triggerValue: "",
						listeningFromMe: false,
						stopBotFromMe: false,
						keepOpen: false,
						debounceTime: 10,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			toast.success("Fluxo removido com sucesso!");
			setShowTypebotConfig(false);
			await fetchInstances();
		} catch (error) {
			console.error("Erro ao remover fluxo:", error);

			let errorMessage = "Erro ao remover fluxo";
			if (error.response) {
				if (error.response.status === 404) {
					errorMessage = "Fluxo não encontrado";
				} else if (error.response.data?.message) {
					errorMessage = error.response.data.message;
				}
			}

			toast.error(errorMessage);
		}
	};

	const handleDeleteInstance = async (instanceId, instanceName) => {
		setDeletingInstance(instanceId);

		// Adicione uma confirmação
		if (
			!window.confirm(
				`Tem certeza que deseja excluir a instância "${instanceName}"?`,
			)
		) {
			setDeletingInstance(null);
			return;
		}

		try {
			// Primeiro, tenta fazer logout da instância
			try {
				await axios.delete(`${API_URL}/instance/logout/${instanceName}`, {
					headers: {
						apikey: API_KEY,
					},
				});

				// Espera um pouco para garantir que o logout foi processado
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} catch (logoutError) {
				console.error("Erro ao desconectar instância:", logoutError);
				// Continua mesmo se o logout falhar, pois a instância pode já estar desconectada
			}

			// Depois, tenta deletar na API externa
			const externalResponse = await axios.delete(
				`${API_URL}/instance/delete/${instanceName}`,
				{
					headers: {
						apikey: API_KEY,
					},
				},
			);

			// Verifica se a deleção na API externa foi bem-sucedida
			if (
				externalResponse.status === 200 &&
				externalResponse.data.status === "SUCCESS" &&
				!externalResponse.data.error
			) {
				// Se a deleção na API externa foi bem-sucedida, deleta no banco local
				const token = localStorage.getItem("token");
				await axios.delete(
					`${API_BASE_URL}/api/instances/instance/${instanceId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				toast.success("Instância excluída com sucesso!");
				fetchInstances();
			} else {
				toast.error("Erro ao excluir instância na API externa");
				console.error(
					"Resposta inesperada da API externa:",
					externalResponse.data,
				);
			}
		} catch (error) {
			console.error("Erro ao excluir instância:", error);

			if (axios.isAxiosError(error)) {
				if (error.response) {
					const status = error.response.status;
					const message =
						error.response.data?.response?.message?.[0] ||
						error.response.data?.message ||
						error.response.data?.error;

					if (status === 404) {
						toast.error(message || "Instância não encontrada na API externa");
					} else if (status === 400) {
						if (message.includes("needs to be disconnected")) {
							toast.error(
								"A instância precisa ser desconectada antes de ser excluída. Tente fazer logout primeiro.",
							);
						} else {
							toast.error(
								message || "Erro ao processar a requisição na API externa",
							);
						}
					} else if (status === 401) {
						toast.error("Sessão expirada. Faça login novamente");
						window.location.href = "/login";
					} else {
						toast.error(message || "Erro ao excluir instância");
					}
				} else if (error.request) {
					toast.error("Erro de conexão com o servidor");
				} else {
					toast.error("Erro ao configurar a requisição");
				}
			} else {
				toast.error("Erro ao excluir instância");
			}
		} finally {
			setDeletingInstance(null);
		}
	};

	const openModal = () => {
		if (remainingSlots <= 0) {
			toast.error(`Limite de instâncias atingido para o plano ${currentPlan}`);
			return;
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setNewInstaceName("");
	};

	const closeQrCodeModal = () => {
		setShowQrCodeModal(false);
		setQrCode(null);
		setQrCodeError(false);
	};

	useEffect(() => {
		fetchInstances();
		setQrCodeError(false);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo px-8 py-10">
			<Toaster position="top-right" />

			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-10 flex justify-between items-center">
					<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-whatsapp-green to-whatsapp-light">
						Instâncias WhatsApp
					</h1>

					<div className="flex space-x-4">
						<motion.button
							onClick={handleRefresh}
							disabled={isRefreshing}
							className={`bg-white/10 p-3 rounded-full shadow-md hover:bg-white/20 ${
								isRefreshing ? "cursor-not-allowed opacity-50" : ""
							}`}
						>
							<RefreshCw
								className={`text-white ${isRefreshing ? "animate-spin" : ""}`}
							/>
						</motion.button>
						<motion.button
							onClick={openModal}
							className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl"
						>
							<Plus className="mr-2" /> Nova Instância
						</motion.button>
					</div>
				</div>

				{/* Status Bar */}
				<div className="mb-4 bg-blue-100 dark:bg-whatsapp-prata/20 p-3 rounded text-black dark:text-white flex justify-between items-center">
					<div className="flex space-x-4">
						<span>Plano Atual: {currentPlan || "Free"}</span>
						<span>Limite de Instâncias: {instanceLimit || 0}</span>
						<span>Slots Restantes: {remainingSlots || 0}</span>
					</div>
				</div>

				{/* Instances Grid */}
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
					</div>
				) : instances.length === 0 ? (
					<div className="text-center bg-white/10 p-10 rounded-xl shadow-lg">
						<Layers className="mx-auto w-16 h-16 text-gray-400 mb-4" />
						<p className="text-gray-300">Nenhuma instância encontrada</p>
					</div>
				) : (
					<motion.div
						layout
						className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
					>
						<AnimatePresence>
							{instances.map((instance) => (
								<InstanceCard
									key={instance.instanceId}
									instance={instance}
									onReconnect={handleReconnectInstance}
									onLogout={handleLogoutInstance}
									onDelete={handleDeleteInstance}
									onConfigureTypebot={handleConfigureTypebot}
									deletingInstance={deletingInstance}
								/>
							))}
						</AnimatePresence>
					</motion.div>
				)}
			</div>

			{/* Modal de Criação de Instância */}
			{isModalOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="bg-white dark:bg-whatsapp-profundo p-8 rounded-xl shadow-2xl w-full max-w-md relative"
					>
						<button
							onClick={closeModal}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
							Criar Nova Instância
						</h2>
						<div className="mb-4">
							<label
								htmlFor="instanceName"
								className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
							>
								Nome da Instância
							</label>
							<input
								type="text"
								id="instanceName"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-whatsapp-prata leading-tight focus:outline-none focus:shadow-outline"
								placeholder="Ex: Instância Principal"
								value={newInstaceName}
								onChange={(e) => setNewInstaceName(e.target.value)}
							/>
						</div>
						<motion.button
							onClick={handleCreateInstance}
							className="bg-gradient-to-r from-whatsapp-green to-whatsapp-dark text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl w-full"
						>
							Criar Instância
						</motion.button>
					</motion.div>
				</motion.div>
			)}

			{/* Modal do QR Code */}
			{showQrCodeModal && qrCode && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="bg-white dark:bg-whatsapp-profundo p-8 rounded-xl shadow-2xl w-full max-w-md relative"
					>
						<button onClick={closeQrCodeModal}>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-zinc-50">
							QR Code para Conexão
						</h2>
						<img
							src={qrCode.base64}
							alt="QR Code"
							className="mx-auto max-w-full h-auto"
							onError={(e) => {
								console.error("Erro ao carregar QR code");
								setQrCodeError(true);
							}}
						/>
						{qrCodeError && (
							<p className="text-red-500 text-center mt-4">
								Erro ao carregar o QR code. Tente fechar e abrir novamente.
							</p>
						)}
						{qrCode.pairingCode && (
							<p className="text-center mt-4 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
								Código de pareamento: <strong>{qrCode.pairingCode}</strong>
							</p>
						)}
						<p className="text-gray-700 dark:text-gray-300 mt-4">
							Use o aplicativo para escanear o QR code e conectar.
							{qrCode.pairingCode && " Ou use o código de pareamento acima."}
						</p>
						<motion.button
							onClick={closeQrCodeModal}
							className="mt-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-md hover:shadow-lg w-full"
						>
							Fechar
						</motion.button>
					</motion.div>
				</motion.div>
			)}

			{/* Modal de Configuração do Typebot */}
			{showTypebotConfig && selectedInstance && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
				>
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 20, opacity: 0 }}
						className="bg-white dark:bg-whatsapp-profundo p-8 rounded-xl shadow-2xl w-full max-w-md relative"
					>
						<button
							onClick={() => setShowTypebotConfig(false)}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
						>
							<X className="w-6 h-6" />
						</button>
						<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
							Configurações do Typebot
						</h2>
						<TypebotConfigForm
							instance={selectedInstance}
							onUpdate={handleUpdateTypebotConfig}
							onDelete={handleDeleteTypebotConfig}
							isEditing={!!selectedInstance?.typebot}
						/>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};
export default Numeros;
