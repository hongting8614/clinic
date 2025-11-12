const TAB_ROUTES = [
  '/pages/index/index',
  '/pages/stock/index',
  '/pages/record/index',
  '/pages/user/index'
]

function clampTabIndex(index) {
  if (index < 0) {
    return 0
  }
  if (index >= TAB_ROUTES.length) {
    return TAB_ROUTES.length - 1
  }
  return index
}

export function createTabSwipeMixin(currentIndex) {
  const safeIndex = clampTabIndex(currentIndex)

  return {
    data() {
      return {
        _tabSwipeStartX: 0,
        _tabSwipeStartY: 0,
        _tabSwipeStartTime: 0,
        _tabSwipeLock: false
      }
    },
    methods: {
      onTabTouchStart(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) {
          return
        }

        const touch = e.changedTouches[0]
        this._tabSwipeStartX = touch.pageX || touch.clientX || 0
        this._tabSwipeStartY = touch.pageY || touch.clientY || 0
        this._tabSwipeStartTime = Date.now()
        this._tabSwipeLock = false
      },

      onTabTouchEnd(e) {
        if (this._tabSwipeLock) {
          return
        }
        if (!e.changedTouches || e.changedTouches.length === 0) {
          return
        }

        const touch = e.changedTouches[0]
        const endX = touch.pageX || touch.clientX || 0
        const endY = touch.pageY || touch.clientY || 0

        const deltaX = endX - this._tabSwipeStartX
        const deltaY = endY - this._tabSwipeStartY
        const deltaTime = Date.now() - this._tabSwipeStartTime

        const MIN_DISTANCE = 80
        const MAX_VERTICAL_OFFSET = 100
        const MAX_DURATION = 800

        if (Math.abs(deltaX) < MIN_DISTANCE) {
          return
        }
        if (Math.abs(deltaY) > MAX_VERTICAL_OFFSET) {
          return
        }
        if (deltaTime > MAX_DURATION) {
          return
        }

        const direction = deltaX < 0 ? 1 : -1
        const nextIndex = safeIndex + direction

        if (nextIndex < 0 || nextIndex >= TAB_ROUTES.length) {
          return
        }

        this._tabSwipeLock = true
        const targetUrl = TAB_ROUTES[nextIndex]
        uni.switchTab({
          url: targetUrl,
          fail: () => {
            this._tabSwipeLock = false
          },
          complete: () => {
            setTimeout(() => {
              this._tabSwipeLock = false
            }, 300)
          }
        })
      }
    }
  }
}

export function getTabRoutes() {
  return [...TAB_ROUTES]
}

