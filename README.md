# PeerShare - A WebRTC based file sharing platform

A React application that enables direct peer-to-peer file transfers using WebRTC technology, with no server required for the actual file transfer.

## 🚀 Features Implemented

### Core Functionality

- ✅ Direct browser-to-browser file transfers using WebRTC data channels
- ✅ No server required for file transfers (only initial SDP exchange needed)
- ✅ Copy/paste connection method for establishing peer connections
- ✅ Large file support with chunked file transfer
- ✅ Real-time progress tracking for both sender and receiver
- ✅ Clean, modern UI using shadcn/ui components

### Architecture

- ✅ Context-based state management with React Context API
- ✅ Componentized structure with separation of concerns
- ✅ TypeScript implementation for type safety
- ✅ Optimized file chunking with flow control

## 🔧 Technical Details

- **WebRTC**: Used for establishing direct peer-to-peer connections
- **Data Channels**: Transfers binary data directly between browsers
- **File Chunking**: Files are broken into 32KB chunks for efficient transfer
- **Flow Control**: Implements send queue with configurable delay between chunks
- **STUN/TURN**: Basic STUN server support for NAT traversal

## 🛣️ Future Roadmap

### Short Term (Easier)

- [x] Drag and drop file interface
- [ ] File preview functionality for common formats
- [ ] Multiple file selection
- [x] UI improvements (responsive design, animations)
- [ ] Enhanced connection status indicators
- [ ] Basic text/clipboard sharing alongside files

### Medium Term (Moderate Complexity)

- [ ] Transfer queue for multiple files
- [ ] Transfer cancellation support
- [ ] File compression for compatible types
- [ ] Simple signaling server for easier connections (optional)
- [ ] QR code generation for connection strings
- [x] Dark/light theme support

### Long Term (Advanced)

- [ ] Connection resilience with transfer resumption
- [ ] File integrity verification (checksums)
- [ ] End-to-end encryption for transfers
- [ ] Multi-peer connections (3+ users)
- [ ] Folder transfer support with directory structure preservation
- [ ] Adaptive chunk sizing based on network conditions

## 🛠️ Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/webrtc-file-transfer.git
cd webrtc-file-transfer

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## 📖 How It Works

1. **Connection Establishment**

   - One peer creates a connection, generating an SDP offer
   - The SDP offer is shared with the second peer (via copy/paste)
   - Second peer adds the SDP offer and generates an SDP answer
   - First peer adds the SDP answer to complete the connection

2. **File Transfer**

   - Sender selects a file to share
   - File is broken into chunks and queued for transfer
   - WebRTC data channel transfers chunks directly to the receiver
   - Receiver assembles chunks into the complete file
   - Progress is tracked and displayed in real-time

## 🤝 Contributing

Contributions are welcome! Check the roadmap for planned features, or submit your own ideas.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
