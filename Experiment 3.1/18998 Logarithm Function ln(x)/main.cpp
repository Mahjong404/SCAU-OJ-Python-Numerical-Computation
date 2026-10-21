#include <cmath>
#include <cstdio>

int main() {
    int m;
    std::scanf("%d", &m);
    while (m--) {
        double x;
        std::scanf("%lf", &x);
        std::printf("%.14Lf\n", std::log(static_cast<long double>(x)));
    }
    return 0;
}
